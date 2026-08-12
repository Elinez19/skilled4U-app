import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { OAuthButton } from "../../components/OAuthButton";
import { LocationReminderModal } from "../../components/LocationReminderModal";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import Toast from "react-native-toast-message";
import { tokenCache } from "../../lib/tokenCache";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, handleGoogleAuth, isLoading } = useCustomerAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@elinez/skilled4u-app",
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;
        if (authentication?.idToken) {
          try {
            const res = await handleGoogleAuth({ 
              idToken: authentication.idToken 
            });
            
            const token = res?.data?.token || res?.token;
            if (token) {
              await tokenCache.saveToken('userToken', token);
            }
            
            Toast.show({
              type: 'success',
              text1: 'Google Sign In Success',
              text2: 'Welcome back to Skilled4U!',
            });
            setShowLocationModal(true);
          } catch (error: any) {
            Toast.show({
              type: 'error',
              text1: 'Google Sign In Failed',
              text2: error?.message || 'Could not authenticate with Google.',
            });
          }
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please enter your email and password.',
      });
      return;
    }

    try {
      const response = await handleLogin({ email, password });
      
      // The token should be in response.data.token if backend structure is as expected.
      // Adjust if backend returns token directly on response.
      const token = response?.data?.token || response?.token;
      
      if (token) {
        await tokenCache.saveToken('userToken', token);
      }

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully signed in.',
      });
      
      setShowLocationModal(true);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: error?.message || 'Invalid credentials or server error.',
      });
    }
  };

  const proceedAfterLogin = () => {
    setShowLocationModal(false);
    router.replace("/(auth)/profile-setup");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center" }}>
          
          <View className="mb-8 mt-12">
            <Text className="h1 mb-2">Welcome Back</Text>
            <Text className="body-md text-neutral-500">
              Sign in to your account to book skilled professionals or manage your services.
            </Text>
          </View>

          <View className="mb-6">
            <InputField
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <View className="items-end mt-2">
              <TouchableOpacity onPress={() => console.log("Forgot Password pressed")}>
                <Text className="body-sm text-primary font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button 
            title="Sign In" 
            onPress={handleSignIn} 
            isLoading={isLoading} 
            className="mb-6"
          />

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-neutral-200" />
            <Text className="mx-4 body-sm text-neutral-500">OR</Text>
            <View className="flex-1 h-px bg-neutral-200" />
          </View>

          <OAuthButton
            provider="google"
            title="Continue with Google"
            onPress={() => promptAsync()}
            disabled={!request}
            className="mb-6"
          />

          <View className="flex-row justify-center mt-auto mb-8">
            <Text className="body-md text-neutral-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="body-md text-primary font-medium">Sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <LocationReminderModal 
        visible={showLocationModal} 
        onClose={proceedAfterLogin} 
        onEnable={proceedAfterLogin} 
      />
    </SafeAreaView>
  );
}
