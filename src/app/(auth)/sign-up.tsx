import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";
import { OAuthButton } from "../../components/OAuthButton";

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    setIsLoading(true);
    // Simulate sign-up for now
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to next screen
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
            <Text className="h1 mb-2">Create Account</Text>
            <Text className="body-md text-neutral-500">
              Join Skilled4U to find and book the best local professionals.
            </Text>
          </View>

          <View className="mb-6">
            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
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
            onPress={() => console.log("Google OAuth pressed")}
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
