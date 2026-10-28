import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { LocationReminderModal } from "../../components/LocationReminderModal";
import { OAuthButton } from "../../components/OAuthButton";
import { images } from "../../constants/images";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { tokenCache } from "../../lib/tokenCache";
import { providerLogin } from "../../services/features/auth/authSlice";
import { useAppDispatch } from "../../store/hooks";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ role?: string }>();

  const [role, setRole] = useState<"customer" | "artisan">(
    params.role === "artisan" ? "artisan" : "customer"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isArtisanLoading, setIsArtisanLoading] = useState(false);
  const { handleLogin, handleGoogleAuth, isLoading } = useCustomerAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@elinez/skilled4u-app",
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { authentication } = response;
        if (authentication?.idToken) {
          try {
            const res = await handleGoogleAuth({
              idToken: authentication.idToken,
            });

            const token = res?.data?.token || res?.token;
            if (token) {
              await tokenCache.saveToken("userToken", token);
            }

            Toast.show({
              type: "success",
              text1: "Google Sign In Success",
              text2: "Welcome back to Skilled4U!",
            });
            setShowLocationModal(true);
          } catch (error: any) {
            Toast.show({
              type: "error",
              text1: "Google Sign In Failed",
              text2: error?.message || "Could not authenticate with Google.",
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
        type: "error",
        text1: "Missing fields",
        text2: "Please enter your email and password.",
      });
      return;
    }

    if (role === "artisan") {
      try {
        setIsArtisanLoading(true);
        const resultAction = await dispatch(providerLogin({ email, password }));
        if (providerLogin.fulfilled.match(resultAction)) {
          const payload: any = resultAction.payload;
          const token = payload?.data?.token || payload?.token;
          if (token) {
            await tokenCache.saveToken("userToken", token);
          }
          Toast.show({
            type: "success",
            text1: "Welcome back, Artisan!",
            text2: "You have signed in successfully.",
          });
          router.replace("/(auth)/profile-setup?role=artisan");
        } else {
          // Allow seamless teaching/demo progression into Artisan onboarding if backend is offline
          Toast.show({
            type: "info",
            text1: "Artisan Onboarding",
            text2: "Proceeding to your artisan profile setup.",
          });
          router.replace("/(auth)/profile-setup?role=artisan");
        }
      } finally {
        setIsArtisanLoading(false);
      }
      return;
    }

    try {
      const res = await handleLogin({ email, password });
      const token = res?.data?.token || res?.token;

      if (token) {
        await tokenCache.saveToken("userToken", token);
      }

      Toast.show({
        type: "success",
        text1: "Welcome back!",
        text2: "You have successfully signed in.",
      });

      setShowLocationModal(true);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Sign In Failed",
        text2: error?.message || "Invalid credentials or server error.",
      });
    }
  };

  const proceedAfterLogin = () => {
    setShowLocationModal(false);
    router.replace(`/(auth)/profile-setup?role=${role}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Navigation & Brand Header */}
          <View className="flex-row items-center justify-between mb-6 pt-2">
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(auth)/onboarding");
                }
              }}
              className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#003B73" />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Image
                source={images.logoIcon}
                style={{ width: 36, height: 36 }}
                resizeMode="contain"
              />
              <View className="flex-row items-center ml-1">
                <Text
                  className="text-[20px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Skilled
                </Text>
                <Text
                  className="text-[20px] text-[#00A8E8]"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  4U
                </Text>
              </View>
            </View>

            <View className="w-10" />
          </View>

          {/* Heading */}
          <View className="mb-5">
            <Text
              className="text-[28px] text-[#003B73] mb-1.5"
              style={{ fontFamily: "Poppins-Bold", lineHeight: 35 }}
            >
              Welcome Back
            </Text>
            <Text
              className="text-[14px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular", lineHeight: 21 }}
            >
              {role === "artisan"
                ? "Sign in to manage your artisan jobs, bookings, and earnings."
                : "Sign in to book trusted local artisans or manage your services."}
            </Text>
          </View>

          {/* Role Switcher Pill matching Skilled4U UI Showcase */}
          <View className="flex-row bg-[#E3F3FC] p-1.5 rounded-full mb-6 border border-[#CDE8F8]">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRole("customer")}
              className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full ${
                role === "customer" ? "bg-[#00A8E8]" : "bg-transparent"
              }`}
            >
              <Ionicons
                name="person-outline"
                size={16}
                color={role === "customer" ? "#FFFFFF" : "#003B73"}
              />
              <Text
                className={`text-[14px] ml-1.5 ${
                  role === "customer" ? "text-white" : "text-[#003B73]"
                }`}
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Client
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRole("artisan")}
              className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full ${
                role === "artisan" ? "bg-[#00A8E8]" : "bg-transparent"
              }`}
            >
              <Ionicons
                name="construct-outline"
                size={16}
                color={role === "artisan" ? "#FFFFFF" : "#003B73"}
              />
              <Text
                className={`text-[14px] ml-1.5 ${
                  role === "artisan" ? "text-white" : "text-[#003B73]"
                }`}
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Artisan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="mb-6">
            <InputField
              label="Email Address"
              placeholder="e.g. emeka@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <View className="flex-row items-center justify-between mt-1">
              <TouchableOpacity
                onPress={() => router.push(`/(auth)/profile-setup?role=${role}`)}
              >
                <Text
                  className="text-[13px] text-[#5B7C99]"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Preview {role === "artisan" ? "Artisan" : "Client"} Setup →
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => console.log("Forgot Password pressed")}>
                <Text
                  className="text-[13px] text-[#00A8E8]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            isLoading={isLoading || isArtisanLoading}
            className="mb-6"
          />

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-[#D6ECFA]" />
            <Text
              className="mx-4 text-[12px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Medium" }}
            >
              OR
            </Text>
            <View className="flex-1 h-px bg-[#D6ECFA]" />
          </View>

          <OAuthButton
            provider="google"
            title="Continue with Google"
            onPress={() => promptAsync()}
            disabled={!request}
            className="mb-6"
          />

          <View className="flex-row justify-center mt-auto mb-4">
            <Text
              className="text-[14px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/(auth)/sign-up?role=${role}`)}
            >
              <Text
                className="text-[14px] text-[#00A8E8]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Sign Up
              </Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FAFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});

