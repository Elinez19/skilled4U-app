import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { ModalSelector } from "../../components/ModalSelector";
import { OAuthButton } from "../../components/OAuthButton";
import { images } from "../../constants/images";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { tokenCache } from "../../lib/tokenCache";
import { providerRegister } from "../../services/features/auth/authSlice";
import { useAppDispatch } from "../../store/hooks";

WebBrowser.maybeCompleteAuthSession();

const COUNTRIES = [
  { label: "Nigeria", value: "NG", subLabel: "+234" },
  { label: "United States", value: "US", subLabel: "+1" },
  { label: "United Kingdom", value: "GB", subLabel: "+44" },
  { label: "Canada", value: "CA", subLabel: "+1" },
  { label: "India", value: "IN", subLabel: "+91" },
  { label: "Trinidad and Tobago", value: "TT", subLabel: "+1868" },
];

export default function SignUpScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ role?: string }>();

  const [role, setRole] = useState<"customer" | "artisan">(
    params.role === "artisan" ? "artisan" : "customer"
  );
  const [fullName, setFullName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCountryModal, setShowCountryModal] = useState(false);
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
          } catch {
            router.replace(`/(auth)/profile-setup?role=${role}`);
          }
        }
      }
    };
    handleGoogleResponse();
  }, [response, role]);

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Required Fields",
        text2: "Please enter your full name, email address, and password.",
      });
      return;
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phoneNumber.trim();
    const formattedPhone = cleanPhone ? `${phoneCode}${cleanPhone}` : "";

    // Persist account details so Profile Setup never asks for them a second time
    try {
      await AsyncStorage.setItem(
        "skilled4u_user_draft",
        JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          phoneCode,
          phoneNumber: cleanPhone,
          formattedPhone,
          role,
        })
      );
    } catch {
      // ignore storage errors
    }

    const nameParts = cleanName.split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const nextUrl = `/(auth)/profile-setup?role=${role}&fullName=${encodeURIComponent(
      cleanName
    )}&email=${encodeURIComponent(cleanEmail)}&phoneCode=${encodeURIComponent(
      phoneCode
    )}&phoneNumber=${encodeURIComponent(cleanPhone)}`;

    if (role === "artisan") {
      try {
        setIsArtisanSubmitting(true);
        const resultAction = await dispatch(
          providerRegister({
            fullName: cleanName,
            phoneNumber: formattedPhone,
            email: cleanEmail,
            password,
          })
        );
        if (providerRegister.fulfilled.match(resultAction)) {
          const payload: any = resultAction.payload;
          const token = payload?.data?.token || payload?.token;
          if (token) {
            await tokenCache.saveToken("userToken", token);
          }
          Toast.show({
            type: "success",
            text1: "Artisan Account Created",
            text2: "Now choose your craft, location, and skills.",
          });
        }
      } catch {
        // Proceed in UI mode even if backend is offline
      } finally {
        setIsArtisanSubmitting(false);
        // @ts-ignore
        router.replace(nextUrl);
      }
      return;
    }

    try {
      const res = await handleRegister({
        firstName,
        lastName,
        phoneNumber: formattedPhone,
        email: cleanEmail,
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
        text2: "Now set your service location to finish up.",
      });
    } catch {
      // Proceed smoothly in UI mode even if backend is offline
    } finally {
      // @ts-ignore
      router.replace(nextUrl);
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Navigation & Brand Header */}
          <View className="flex-row items-center justify-between mb-5 pt-2">
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/");
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
              {role === "artisan"
                ? "Create Your Artisan Account"
                : "Create Your Account"}
            </Text>
            <Text
              className="text-[14px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
            >
              {role === "artisan"
                ? "Enter your details once. Next, you'll choose your craft, service area, and skills."
                : "Enter your details once. Next, you'll confirm your location."}
            </Text>
          </View>

          {/* Segmented Role Toggle */}
          <View className="flex-row bg-[#E3F3FC] p-1.5 rounded-full mb-5 border border-[#CDE8F8]">
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

          {/* Account Credentials Form */}
          <View className="mb-4">
            <InputField
              label="Full Name"
              placeholder="e.g. Elijah Ndenwa"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              leftIcon="person-outline"
            />

            <InputField
              label="Email Address"
              placeholder="e.g. elijah@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <View className="mb-4">
              <Text
                className="text-[14px] text-[#003B73] mb-1.5"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Phone Number
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setShowCountryModal(true)}
                  className="flex-row items-center justify-center border border-[#D0E8F8] rounded-2xl bg-white px-3.5 h-14 mr-2.5"
                >
                  <View className="flex-row items-center mr-1.5">
                    <View className="w-2 h-3.5 bg-[#008751]" />
                    <View className="w-2 h-3.5 bg-white border-y border-neutral-200" />
                    <View className="w-2 h-3.5 bg-[#008751]" />
                  </View>
                  <Text
                    className="text-[14px] text-[#003B73] mr-1"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {phoneCode}
                  </Text>
                  <Ionicons name="chevron-down" size={15} color="#3B6998" />
                </TouchableOpacity>

                <View className="flex-1">
                  <InputField
                    placeholder="812 345 6789"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    className="mb-0"
                  />
                </View>
              </View>
            </View>

            <InputField
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />
          </View>

          <Button
            title="Continue"
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
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        title="Select Country"
        searchPlaceholder="Search Country"
        options={COUNTRIES}
        onSelect={(val) => {
          const selected = COUNTRIES.find((c) => c.value === val);
          if (selected) {
            setPhoneCode(selected.subLabel);
          }
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
