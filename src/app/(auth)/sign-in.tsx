import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { OAuthButton } from "../../components/OAuthButton";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    // Simulate sign-in for now
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(auth)/profile-setup");
    }, 1500);
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
            onPress={() => console.log("Google OAuth pressed")}
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
    </SafeAreaView>
  );
}
