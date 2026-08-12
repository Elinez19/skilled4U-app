import React, { useState, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";
import { OAuthButton } from "../../components/OAuthButton";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import Toast from "react-native-toast-message";
import { tokenCache } from "../../lib/tokenCache";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleRegister, handleGoogleAuth, isLoading } = useCustomerAuth();

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
              idToken: authentication.idToken,
              role: 'customer' // Sending role for sign-up if needed
            });
            
            const token = res?.data?.token || res?.token;
            if (token) {
              await tokenCache.saveToken('userToken', token);
            }
            
            Toast.show({
              type: 'success',
              text1: 'Google Sign In Success',
              text2: 'Welcome to Skilled4U!',
            });
            router.replace("/(auth)/profile-setup");
          } catch (error: any) {
            Toast.show({
              type: 'error',
              text1: 'Google Sign Up Failed',
              text2: error?.message || 'Could not authenticate with Google.',
            });
          }
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill in all the required fields.',
      });
      return;
    }

    try {
      const response = await handleRegister({ 
        firstName, 
        lastName, 
        email, 
        password,
        confirmPassword: password 
      });

      const token = response?.data?.token || response?.token;
      
      if (token) {
        await tokenCache.saveToken('userToken', token);
      }

      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Welcome to Skilled4U!',
      });
      
      // Navigate to profile setup screen
      router.replace("/(auth)/profile-setup");
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error?.message || 'Something went wrong during registration.',
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center" }}>
          
          <View className="mb-8 mt-12">
            <Text className="h1 mb-2">Create Account</Text>
            <Text className="body-md text-neutral-500">
              Join Skilled4U to find and book the best local professionals.
            </Text>
          </View>

          <View className="mb-6">
            <InputField
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <InputField
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button 
            title="Sign Up" 
            onPress={handleSignUp} 
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
            <Text className="body-md text-neutral-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="body-md text-primary font-medium">Sign in</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
