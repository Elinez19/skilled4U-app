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
import { ModalSelector } from "../../components/ModalSelector";
import { OAuthButton } from "../../components/OAuthButton";
import { SelectField } from "../../components/SelectField";
import { images } from "../../constants/images";
import { ARTISAN_CRAFT_CATEGORIES } from "../../data/categories";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { tokenCache } from "../../lib/tokenCache";
import { providerRegister } from "../../services/features/auth/authSlice";
import { useAppDispatch } from "../../store/hooks";

WebBrowser.maybeCompleteAuthSession();

const TRADE_OPTIONS = ARTISAN_CRAFT_CATEGORIES.map((item) => ({
  label: item.title,
  value: item.id,
}));

export default function SignUpScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ role?: string }>();

  const [role, setRole] = useState<"customer" | "artisan">(
    params.role === "artisan" ? "artisan" : "customer"
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [isArtisanSubmitting, setIsArtisanSubmitting] = useState(false);

  const { handleRegister, handleGoogleAuth, isLoading } = useCustomerAuth();

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
              role: role === "artisan" ? "provider" : "customer",
            });

            const token = res?.data?.token || res?.token;
            if (token) {
              await tokenCache.saveToken("userToken", token);
            }

            Toast.show({
              type: "success",
              text1: "Google Sign Up Success",
              text2: "Welcome to Skilled4U!",
            });
            router.replace(`/(auth)/profile-setup?role=${role}`);
          } catch (error: any) {
            Toast.show({
              type: "error",
              text1: "Google Sign Up Failed",
              text2: error?.message || "Could not authenticate with Google.",
            });
          }
        }
      }
    };
    handleGoogleResponse();
  }, [response, role]);

  const handleSignUp = async () => {
    if (!firstName || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    if (role === "artisan") {
      try {
        setIsArtisanSubmitting(true);
        const resultAction = await dispatch(
          providerRegister({
            fullName: `${firstName} ${lastName}`.trim(),
            phoneNumber,
            email,
            trade,
            location,
            password,
          })
        );
        if (providerRegister.fulfilled.match(resultAction)) {
          Toast.show({
            type: "success",
            text1: "Artisan Account Created",
            text2: "Let's complete your artisan profile.",
          });
        }
        router.replace("/(auth)/profile-setup?role=artisan");
      } finally {
        setIsArtisanSubmitting(false);
      }
      return;
    }

    try {
      const res = await handleRegister({
        firstName,
        lastName: lastName || firstName,
        email,
        password,
        confirmPassword: password,
      });

      const token = res?.data?.token || res?.token;
      if (token) {
        await tokenCache.saveToken("userToken", token);
      }

      Toast.show({
        type: "success",
        text1: "Account Created",
        text2: "Welcome to Skilled4U!",
      });

      router.replace("/(auth)/profile-setup?role=customer");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Sign Up Failed",
        text2: error?.message || "Something went wrong during registration.",
      });
    }
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
          <View className="flex-row items-center justify-between mb-5 pt-2">
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
          <View className="mb-4">
            <Text
              className="text-[24px] text-[#003B73] mb-1"
              style={{ fontFamily: "Poppins-Bold", lineHeight: 31 }}
            >
              {role === "artisan" ? "Create Your Artisan Account" : "Create Your Account"}
            </Text>
            <Text
              className="text-[14px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
            >
              {role === "artisan"
                ? "Join thousands of skilled artisans on Skilled4U and get more work."
                : "Join Skilled4U to find and book the best local professionals."}
            </Text>
          </View>

          {/* Segmented Role Toggle matching Skilled4U UI Showcase */}
          <View className="flex-row bg-[#E3F3FC] p-1.5 rounded-full mb-5 border border-[#CDE8F8]">
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
          </View>

          {/* Form Fields */}
          <View className="mb-4">
            {role === "artisan" ? (
              <>
                <InputField
                  placeholder="Full Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  leftIcon="person-outline"
                />
                <InputField
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  leftIcon="call-outline"
                />
                <InputField
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
                />
                <SelectField
                  placeholder="Choose Trade (e.g. Plumber, Electrician)"
                  value={trade}
                  onPress={() => setShowTradeModal(true)}
                  leftIcon="construct-outline"
                />
                <InputField
                  placeholder="Location (City, State)"
                  value={location}
                  onChangeText={setLocation}
                  leftIcon="location-outline"
                />
                <InputField
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon="lock-closed-outline"
                />
              </>
            ) : (
              <>
                <InputField
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  leftIcon="person-outline"
                />
                <InputField
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  leftIcon="person-outline"
                />
                <InputField
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
                />
                <InputField
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon="lock-closed-outline"
                />
              </>
            )}
          </View>

          <Button
            title="Create Account"
            onPress={handleSignUp}
            isLoading={isLoading || isArtisanSubmitting}
            className="mb-5"
          />

          <View className="flex-row items-center mb-5">
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
            className="mb-5"
          />

          <View className="flex-row justify-center mt-auto mb-4">
            <Text
              className="text-[14px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/(auth)/sign-in?role=${role}`)}
            >
              <Text
                className="text-[14px] text-[#00A8E8]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalSelector
        visible={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        title="Choose Your Trade"
        searchPlaceholder="Search trade..."
        iconName="construct-outline"
        options={TRADE_OPTIONS}
        onSelect={(val) => {
          const found = TRADE_OPTIONS.find((t) => t.value === val);
          if (found) setTrade(found.label);
        }}
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
