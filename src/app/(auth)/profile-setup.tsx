import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import { LocationAutocomplete } from "../../components/LocationAutocomplete";
import { ModalSelector } from "../../components/ModalSelector";
import { SelectField } from "../../components/SelectField";
import {
  ARTISAN_CRAFT_CATEGORIES,
  ARTISAN_SKILLS_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  OnboardingServiceItem,
  SERVICE_RADIUS_OPTIONS,
} from "../../data/categories";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { setupProfile } from "../../services/features/auth/authSlice";
import { setLocation } from "../../services/features/location/locationSlice";
import { useAppDispatch } from "../../store/hooks";

const HEAR_ABOUT_OPTIONS = [
  { label: "Google", value: "Google" },
  { label: "Instagram", value: "Instagram" },
  { label: "Facebook", value: "Facebook" },
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "TikTok", value: "TikTok" },
  { label: "Family / Friends", value: "Family / Friends" },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{
    role?: string;
    step?: string;
    fullName?: string;
    email?: string;
    phoneCode?: string;
    phoneNumber?: string;
  }>();
  const { handleProfileSetup, isLoading } = useCustomerAuth();

  const [mode, setMode] = useState<"artisan" | "customer">(
    params.role === "artisan" ? "artisan" : "customer"
  );

  // Artisan 3-step profile wizard + Step 4 Completion screen:
  // Step 1: Craft Category
  // Step 2: Location & Service Area (Mapbox)
  // Step 3: Skills & Experience
  // Step 4: You're All Set!
  const initialStep = params.step ? Number(params.step) : 1;
  const [artisanStep, setArtisanStep] = useState<number>(
    initialStep >= 1 && initialStep <= 4 ? initialStep : 1
  );

  // Pre-populated account credentials from Sign Up (no duplicate inputs!)
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState(params.fullName || "");
  const [email, setEmail] = useState(params.email || "");
  const [phoneCode, setPhoneCode] = useState(params.phoneCode || "+234");
  const [phoneNumber, setPhoneNumber] = useState(params.phoneNumber || "");

  // Artisan Step 1: Craft Category
  const [selectedCraft, setSelectedCraft] = useState<string>("plumber");

  // Shared Location & Coordinates state
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 9.0765,
    lon: 7.4765,
  });
  const [serviceRadius, setServiceRadius] = useState("5 km");

  // Artisan Step 3: Skills & Experience
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "plumbing",
    "installation",
  ]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);
  const [isSubmittingArtisan, setIsSubmittingArtisan] = useState(false);

  // Customer specific
  const [hearAbout, setHearAbout] = useState("");

  // Modals state
  const [showHearAboutModal, setShowHearAboutModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showRadiusModal, setShowRadiusModal] = useState(false);

  // Hydrate account details captured on Sign Up so user never re-types them
  useEffect(() => {
    const loadDraftUser = async () => {
      try {
        const raw = await AsyncStorage.getItem("skilled4u_user_draft");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!fullName && parsed.fullName) setFullName(parsed.fullName);
          if (!email && parsed.email) setEmail(parsed.email);
          if (parsed.phoneCode) setPhoneCode(parsed.phoneCode);
          if (!phoneNumber && parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        }
      } catch {
        // ignore storage errors
      }
    };
    loadDraftUser();
  }, []);

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((item) => item !== skillId)
        : [...prev, skillId]
    );
  };

  const pickAvatarImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const pickPortfolioPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.85,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setPortfolioPhotos((prev) => [...prev, ...uris].slice(0, 6));
    }
  };

  const removePortfolioPhoto = (uri: string) => {
    setPortfolioPhotos((prev) => prev.filter((item) => item !== uri));
  };

  const syncLocationToStore = (finalAddress: string) => {
    dispatch(
      setLocation({
        address: finalAddress || "Wuse 2, Abuja",
        latitude: coords.lat,
        longitude: coords.lon,
        status: "success",
      })
    );
  };

  const handleArtisanNext = async () => {
    if (artisanStep === 2 && !address.trim()) {
      Toast.show({
        type: "error",
        text1: "Location Required",
        text2: "Please search or select your service location on the map.",
      });
      return;
    }

    if (artisanStep < 3) {
      if (artisanStep === 2) {
        syncLocationToStore(address.trim());
      }
      setArtisanStep((prev) => prev + 1);
      return;
    }

    if (artisanStep === 3) {
      const finalAddress = address.trim() || "Wuse 2, Abuja";
      syncLocationToStore(finalAddress);

      try {
        setIsSubmittingArtisan(true);
        await dispatch(
          setupProfile({
            craftCategory: selectedCraft,
            fullName: fullName || "Artisan Pro",
            phoneNumber: phoneNumber ? `${phoneCode}${phoneNumber}` : "",
            email: email || "",
            address: finalAddress,
            serviceRadius: serviceRadius || "5 km",
            skills: selectedSkills,
            experienceLevel: experienceLevel || "3 - 5 years",
            portfolioPhotos,
          })
        );
      } catch {
        // Proceed to completion screen even if backend is offline
      } finally {
        setIsSubmittingArtisan(false);
        setArtisanStep(4);
      }
      return;
    }

    // Step 4 -> Go to Dashboard
    // @ts-ignore
    router.replace("/(tabs)");
  };

  const handleArtisanBack = () => {
    if (artisanStep > 1) {
      setArtisanStep((prev) => prev - 1);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/sign-up?role=artisan");
    }
  };

  const handleCustomerSave = async () => {
    if (!address.trim()) {
      Toast.show({
        type: "error",
        text1: "Address Required",
        text2: "Please enter or select your location so we can find nearby artisans.",
      });
      return;
    }

    const finalAddress = address.trim();
    syncLocationToStore(finalAddress);

    try {
      await AsyncStorage.setItem(
        "skilled4u_user_draft",
        JSON.stringify({
          fullName: fullName || "Skilled4U Client",
          email,
          phoneCode,
          phoneNumber,
          address: finalAddress,
          hearAboutUs: hearAbout,
          avatar,
          role: "customer",
        })
      );
    } catch {
      // ignore storage errors
    }

    try {
      const payload = {
        fullName: fullName || "Skilled4U Client",
        email,
        phoneNumber: phoneNumber ? `${phoneCode}${phoneNumber}` : "",
        address: finalAddress,
        hearAboutUs: hearAbout || "Google",
      };

      await handleProfileSetup(payload);
    } catch {
      // Allow seamless completion into the main app even when backend is offline
    } finally {
      Toast.show({
        type: "success",
        text1: "Profile Ready!",
        text2: `Showing artisans near ${finalAddress.split(",")[0]}.`,
      });
      // @ts-ignore
      router.replace("/(tabs)");
    }
  };

  const renderCategoryIcon = (item: OnboardingServiceItem) => {
    if (item.iconFamily === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={item.iconName as any}
          size={24}
          color="#0099DF"
        />
      );
    }
    return <Ionicons name={item.iconName as any} size={22} color="#0099DF" />;
  };

  // Connected 3-dot progress indicator for Artisan Steps 1..3
  const renderStepDots = () => {
    return (
      <View className="flex-row items-center justify-center">
        {[1, 2, 3].map((dotStep, idx) => {
          const isCompletedOrActive = dotStep <= artisanStep;
          const isCurrent = artisanStep === dotStep;

          return (
            <View key={dotStep} className="flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  if (dotStep < artisanStep) {
                    setArtisanStep(dotStep);
                  }
                }}
                className={`rounded-full ${
                  isCurrent
                    ? "w-6 h-2.5 bg-[#0099DF]"
                    : isCompletedOrActive
                      ? "w-2.5 h-2.5 bg-[#00A8E8]"
                      : "w-2.5 h-2.5 bg-[#CDE8F8]"
                }`}
              />
              {idx < 2 ? (
                <View
                  className={`w-6 h-[1.5px] mx-1.5 ${
                    dotStep < artisanStep ? "bg-[#8CD8F8]" : "bg-[#D8EEFC]"
                  }`}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    );
  };

  const leftColumnSkills = ARTISAN_SKILLS_OPTIONS.filter((_, i) => i % 2 === 0);
  const rightColumnSkills = ARTISAN_SKILLS_OPTIONS.filter((_, i) => i % 2 === 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {mode === "artisan" ? (
          <View className="flex-1 justify-between">
            {/* Top Navigation Bar with Back Arrow + 3 Connected Step Dots */}
            <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
              <TouchableOpacity
                onPress={handleArtisanBack}
                className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center"
              >
                <Ionicons name="arrow-back" size={20} color="#003B73" />
              </TouchableOpacity>

              {artisanStep < 4 ? renderStepDots() : <View />}

              <View className="px-2.5 py-1 rounded-full bg-[#E6F7FF] border border-[#B8E2F8]">
                <Text
                  className="text-[11px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {artisanStep < 4 ? `Step ${artisanStep}/3` : "Done"}
                </Text>
              </View>
            </View>

            {/* =====================================================
                STEP 1: CHOOSE CRAFT CATEGORY
                (skilled4-Artisan-Onboarding-choose-category-screen.png)
               ===================================================== */}
            {artisanStep === 1 && (
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {fullName ? (
                  <View className="flex-row items-center bg-white border border-[#D6ECFA] rounded-2xl px-3.5 py-2.5 mt-1 mb-3">
                    <View className="w-8 h-8 rounded-full bg-[#E6F7FF] items-center justify-center mr-2.5">
                      <Ionicons name="person" size={15} color="#00A8E8" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[13px] text-[#003B73]"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                        numberOfLines={1}
                      >
                        Welcome, {fullName}
                      </Text>
                      <Text
                        className="text-[11px] text-[#5B7C99]"
                        style={{ fontFamily: "Poppins-Regular" }}
                        numberOfLines={1}
                      >
                        {email || `${phoneCode} ${phoneNumber}`}
                      </Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  </View>
                ) : null}

                <Text
                  className="text-[26px] text-[#003B73] mt-1 mb-1.5"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 33 }}
                >
                  What type of artisan{"\n"}are you?
                </Text>
                <Text
                  className="text-[15px] text-[#5B7C99] mb-5"
                  style={{ fontFamily: "Poppins-Regular", lineHeight: 22 }}
                >
                  Select the category that best describes{"\n"}your primary skill.
                </Text>

                <View className="flex-row flex-wrap justify-between mb-6">
                  {ARTISAN_CRAFT_CATEGORIES.map((item) => {
                    const isSelected = selectedCraft === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.8}
                        onPress={() => setSelectedCraft(item.id)}
                        style={[styles.craftCard, styles.cardShadow]}
                        className={`mb-3.5 p-3.5 rounded-2xl items-center justify-center border relative ${
                          isSelected
                            ? "bg-[#EAF7FF] border-[#00A8E8]"
                            : "bg-white border-[#D8EEFC]"
                        }`}
                      >
                        {isSelected ? (
                          <View className="absolute top-2 right-2">
                            <Ionicons name="checkmark-circle" size={16} color="#00A8E8" />
                          </View>
                        ) : null}
                        <View className="w-12 h-12 rounded-full bg-[#E6F7FF] items-center justify-center mb-2.5">
                          {renderCategoryIcon(item)}
                        </View>
                        <Text
                          className="text-[12px] text-[#003B73] text-center"
                          style={{ fontFamily: "Poppins-SemiBold" }}
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View className="mt-auto pt-2">
                  <Button title="Continue" onPress={handleArtisanNext} />
                </View>
              </ScrollView>
            )}

            {/* =====================================================
                STEP 2: YOUR LOCATION & SERVICE AREA (LIVE MAPBOX)
                (skilled4-Artisan-Onboarding-Location-screen.png)
               ===================================================== */}
            {artisanStep === 2 && (
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text
                  className="text-[26px] text-[#003B73] mt-2 mb-1.5"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 33 }}
                >
                  Your Location
                </Text>
                <Text
                  className="text-[15px] text-[#5B7C99] mb-4"
                  style={{ fontFamily: "Poppins-Regular", lineHeight: 22 }}
                >
                  Help clients find you in your service area.
                </Text>

                <LocationAutocomplete
                  label="Base Address / Workshop Location"
                  placeholder="e.g. Wuye, Abuja or Lekki, Lagos"
                  initialValue={address}
                  showMapPreview={true}
                  serviceRadius={serviceRadius}
                  onChangeText={setAddress}
                  onSelect={(loc) => {
                    setAddress(loc.display_name);
                    setCoords({
                      lat: parseFloat(loc.lat) || 9.0765,
                      lon: parseFloat(loc.lon) || 7.4765,
                    });
                  }}
                />

                <SelectField
                  label="Service Area (Radius)"
                  placeholder="e.g. 5 km"
                  value={serviceRadius}
                  onPress={() => setShowRadiusModal(true)}
                />

                <View className="mt-auto pt-6">
                  <Button title="Continue" onPress={handleArtisanNext} />
                </View>
              </ScrollView>
            )}

            {/* =====================================================
                STEP 3: SKILLS & EXPERIENCE
                (skilled4-Artisan-Onboarding-Skills-and Experience-screen.png)
               ===================================================== */}
            {artisanStep === 3 && (
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text
                  className="text-[26px] text-[#003B73] mt-1 mb-1"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 33 }}
                >
                  Skills & Experience
                </Text>
                <Text
                  className="text-[15px] text-[#5B7C99] mb-5"
                  style={{ fontFamily: "Poppins-Regular", lineHeight: 21 }}
                >
                  Tell us about your expertise and{"\n"}experience.
                </Text>

                {/* Skills (Select all that apply) */}
                <View className="mb-4">
                  <Text
                    className="text-[14px] text-[#003B73] mb-2"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Skills{" "}
                    <Text
                      className="text-[#5B7C99]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      (Select all that apply)
                    </Text>
                  </Text>

                  <View className="flex-row justify-between">
                    {/* Left Column */}
                    <View
                      style={styles.skillsColumn}
                      className="bg-white/90 rounded-2xl border border-[#DCEFFB] p-1.5"
                    >
                      {leftColumnSkills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill.id);
                        return (
                          <TouchableOpacity
                            key={skill.id}
                            activeOpacity={0.8}
                            onPress={() => toggleSkill(skill.id)}
                            className={`flex-row items-center px-2.5 py-2.5 my-0.5 rounded-xl border ${
                              isSelected
                                ? "bg-[#EAF7FF] border-[#00A8E8]"
                                : "bg-transparent border-transparent"
                            }`}
                          >
                            <View className="w-9 h-9 rounded-full bg-[#E6F7FF] items-center justify-center mr-2.5">
                              <View
                                className={`w-5 h-5 rounded-full items-center justify-center ${
                                  isSelected ? "bg-[#0099DF]" : "bg-[#BAE6FD]"
                                }`}
                              >
                                <Ionicons
                                  name={
                                    isSelected
                                      ? "checkmark"
                                      : (skill.iconName as any)
                                  }
                                  size={12}
                                  color="#FFFFFF"
                                />
                              </View>
                            </View>
                            <Text
                              className="text-[13px] text-[#003B73] flex-1"
                              style={{ fontFamily: "Poppins-Medium" }}
                              numberOfLines={1}
                            >
                              {skill.title}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Right Column */}
                    <View
                      style={styles.skillsColumn}
                      className="bg-white/90 rounded-2xl border border-[#DCEFFB] p-1.5"
                    >
                      {rightColumnSkills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill.id);
                        return (
                          <TouchableOpacity
                            key={skill.id}
                            activeOpacity={0.8}
                            onPress={() => toggleSkill(skill.id)}
                            className={`flex-row items-center px-2.5 py-2.5 my-0.5 rounded-xl border ${
                              isSelected
                                ? "bg-[#EAF7FF] border-[#00A8E8]"
                                : "bg-transparent border-transparent"
                            }`}
                          >
                            <View className="w-9 h-9 rounded-full bg-[#E6F7FF] items-center justify-center mr-2.5">
                              <Ionicons
                                name={
                                  isSelected
                                    ? "checkmark-circle"
                                    : (skill.iconName as any)
                                }
                                size={18}
                                color="#0099DF"
                              />
                            </View>
                            <Text
                              className="text-[13px] text-[#003B73] flex-1"
                              style={{ fontFamily: "Poppins-Medium" }}
                              numberOfLines={1}
                            >
                              {skill.title}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>

                {/* Years of Experience */}
                <SelectField
                  label="Years of Experience"
                  placeholder="Select experience level"
                  value={experienceLevel}
                  onPress={() => setShowExperienceModal(true)}
                  className="mb-4"
                />

                {/* Upload Portfolio (Optional) */}
                <View className="mb-6">
                  <Text
                    className="text-[14px] text-[#003B73] mb-2"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Upload Portfolio{" "}
                    <Text
                      className="text-[#5B7C99]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      (Optional)
                    </Text>
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={pickPortfolioPhoto}
                    className="w-full rounded-2xl border-2 border-dashed border-[#A5DBF8] bg-[#F2FAFF] py-5 px-4 items-center justify-center"
                  >
                    <View className="w-9 h-9 rounded-full bg-[#E1F4FF] items-center justify-center mb-2">
                      <Ionicons
                        name="cloud-upload-outline"
                        size={20}
                        color="#0099DF"
                      />
                    </View>
                    <Text
                      className="text-[13px] text-[#5B7C99] text-center"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      Add photos of your work
                    </Text>
                    <Text
                      className="text-[12px] text-[#6889A8] text-center mt-0.5"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      (jpg, png - max 5MB)
                    </Text>
                  </TouchableOpacity>

                  {portfolioPhotos.length > 0 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingTop: 10, gap: 10 }}
                    >
                      {portfolioPhotos.map((uri) => (
                        <View
                          key={uri}
                          className="w-16 h-16 rounded-xl overflow-hidden border border-[#00A8E8] relative"
                        >
                          <Image
                            source={{ uri }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            onPress={() => removePortfolioPhoto(uri)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#003B73]/80 items-center justify-center"
                          >
                            <Ionicons name="close" size={12} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  ) : null}
                </View>

                <View className="mt-auto">
                  <Button
                    title="Complete Setup"
                    onPress={handleArtisanNext}
                    isLoading={isSubmittingArtisan}
                  />
                </View>
              </ScrollView>
            )}

            {/* =====================================================
                STEP 4: ONBOARDING COMPLETE
                (skilled4-Artisan-Onboarding-Completed-screen.png)
               ===================================================== */}
            {artisanStep === 4 && (
              <View className="flex-1 px-6 pb-8 justify-center items-center">
                <View className="w-56 h-56 items-center justify-center relative mb-4">
                  <View className="absolute top-6 left-10 w-3 h-3 rounded-full bg-[#00A8E8]/60" />
                  <View className="absolute top-4 right-12 w-3.5 h-3.5 rounded-sm bg-[#0099DF] rotate-45" />
                  <View className="absolute bottom-10 left-8 w-3 h-3 rounded-sm bg-[#20BDFF] rotate-12" />
                  <View className="absolute bottom-8 right-10 w-3.5 h-3.5 rounded-full bg-[#00A8E8]/75" />
                  <View className="absolute top-1/2 left-4 w-2.5 h-2.5 rounded-full bg-[#66CFFF]" />
                  <View className="absolute top-1/3 right-4 w-3 h-3 rounded-sm bg-[#38C8FF] rotate-45" />

                  <View className="w-36 h-36 rounded-full bg-[#E1F4FF] items-center justify-center">
                    <View
                      style={styles.pinShadow}
                      className="w-28 h-28 rounded-full bg-[#00A8E8] border-4 border-[#66D3FF] items-center justify-center"
                    >
                      <Ionicons name="checkmark" size={56} color="#FFFFFF" />
                    </View>
                  </View>
                </View>

                <Text
                  className="text-[28px] text-[#003B73] text-center mb-3"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  You&apos;re All Set!
                </Text>

                <Text
                  className="text-[14px] text-[#5B7C99] text-center px-3 mb-8"
                  style={{ fontFamily: "Poppins-Regular", lineHeight: 22 }}
                >
                  Your artisan profile has been created{"\n"}and is ready to
                  connect you with{"\n"}nearby clients in your area.
                </Text>

                <Button
                  title="Go to Dashboard"
                  onPress={handleArtisanNext}
                  className="mb-6"
                />

                <View className="flex-row items-center justify-center">
                  <Text
                    className="text-[13px] text-[#5B7C99]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    Need help?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      // @ts-ignore
                      router.replace("/(tabs)/support");
                    }}
                  >
                    <Text
                      className="text-[13px] text-[#00A8E8]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Contact Support
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          /* =====================================================
             CUSTOMER PROFILE SETUP MODE (ZERO DUPLICATE FIELDS)
             ===================================================== */
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header Bar */}
            <View className="flex-row items-center justify-between pt-2 mb-4">
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace("/(auth)/sign-up?role=customer");
                  }
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center"
              >
                <Ionicons name="arrow-back" size={20} color="#003B73" />
              </TouchableOpacity>

              <Text
                className="text-[20px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Set Your Location
              </Text>

              <TouchableOpacity
                onPress={() => {
                  // @ts-ignore
                  router.replace("/(tabs)");
                }}
                className="px-3 py-1.5 rounded-full bg-white border border-[#D6ECFA]"
              >
                <Text
                  className="text-[12px] text-[#5B7C99]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Skip
                </Text>
              </TouchableOpacity>
            </View>

            {/* Avatar + Verified Account Summary Card (Replaces Duplicate Name/Email/Phone Inputs) */}
            <View className="bg-white rounded-3xl p-4 mb-5 border border-[#D6ECFA] flex-row items-center">
              <TouchableOpacity onPress={pickAvatarImage} className="relative mr-4">
                <View className="w-20 h-20 rounded-full bg-[#E6F7FF] items-center justify-center border-2 border-[#00A8E8] overflow-hidden">
                  {avatar ? (
                    <Image source={{ uri: avatar }} className="w-full h-full" />
                  ) : (
                    <Ionicons name="person-outline" size={34} color="#00A8E8" />
                  )}
                </View>
                <View className="absolute bottom-0 right-0 w-7 h-7 bg-[#003B73] rounded-full items-center justify-center border-2 border-white">
                  <Ionicons name="camera" size={13} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <View className="flex-1">
                <View className="flex-row items-center mb-0.5">
                  <Text
                    className="text-[16px] text-[#003B73] mr-1.5"
                    style={{ fontFamily: "Poppins-Bold" }}
                    numberOfLines={1}
                  >
                    {fullName || "Welcome to Skilled4U"}
                  </Text>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                </View>

                {email ? (
                  <Text
                    className="text-[12px] text-[#5B7C99]"
                    style={{ fontFamily: "Poppins-Regular" }}
                    numberOfLines={1}
                  >
                    {email}
                  </Text>
                ) : null}

                {phoneNumber ? (
                  <Text
                    className="text-[12px] text-[#5B7C99] mt-0.5"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {phoneCode} {phoneNumber}
                  </Text>
                ) : (
                  <Text
                    className="text-[11px] text-[#00A8E8] mt-0.5"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    Tap photo to add a profile picture
                  </Text>
                )}
              </View>
            </View>

            {/* Interactive Mapbox Location & Address Search */}
            <LocationAutocomplete
              label="Full Address / Service Location"
              placeholder="Search neighborhood or street (e.g. Wuye, Abuja)"
              initialValue={address}
              onChangeText={setAddress}
              onSelect={(loc) => {
                setAddress(loc.display_name);
                setCoords({
                  lat: parseFloat(loc.lat) || 9.0765,
                  lon: parseFloat(loc.lon) || 7.4765,
                });
              }}
            />

            <SelectField
              label="How did you hear about Skilled4U? (Optional)"
              placeholder="Select an option"
              value={hearAbout}
              onPress={() => setShowHearAboutModal(true)}
              className="mb-6"
            />

            <View className="mt-auto pt-2">
              <Button
                title="Save & Continue"
                onPress={handleCustomerSave}
                isLoading={isLoading}
              />
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {/* Experience Level Modal */}
      <ModalSelector
        visible={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        title="Years of Experience"
        searchPlaceholder="Search experience level"
        iconName="briefcase-outline"
        options={EXPERIENCE_LEVEL_OPTIONS}
        onSelect={(val) => {
          const selected = EXPERIENCE_LEVEL_OPTIONS.find((e) => e.value === val);
          if (selected) setExperienceLevel(selected.label);
        }}
      />

      {/* Service Area Radius Modal */}
      <ModalSelector
        visible={showRadiusModal}
        onClose={() => setShowRadiusModal(false)}
        title="Service Area (Radius)"
        searchPlaceholder="Select radius"
        iconName="locate-outline"
        options={SERVICE_RADIUS_OPTIONS}
        onSelect={(val) => {
          setServiceRadius(val);
        }}
      />

      {/* Hear About Modal */}
      <ModalSelector
        visible={showHearAboutModal}
        onClose={() => setShowHearAboutModal(false)}
        title="How did you hear about us?"
        searchPlaceholder="Search an option"
        options={HEAR_ABOUT_OPTIONS}
        iconName="help-circle-outline"
        onSelect={(val) => {
          const selected = HEAR_ABOUT_OPTIONS.find((h) => h.value === val);
          if (selected) setHearAbout(selected.label);
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
    paddingBottom: 28,
  },
  craftCard: {
    width: "31%",
    minHeight: 110,
  },
  skillsColumn: {
    width: "48.5%",
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pinShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
