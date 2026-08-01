import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { LocationAutocomplete } from "../../components/LocationAutocomplete";
import { ModalSelector } from "../../components/ModalSelector";
import { SelectField } from "../../components/SelectField";

const COUNTRIES = [
  { label: "Canada", value: "CA", subLabel: "+1" },
  { label: "India", value: "IN", subLabel: "+91" },
  { label: "Nigeria", value: "NG", subLabel: "+234" },
  { label: "Test_country", value: "TEST", subLabel: "+0123" },
  { label: "Trinidad and Tobago", value: "TT", subLabel: "+1868" },
  { label: "United Kingdom", value: "GB", subLabel: "+44" },
  { label: "UNITED STATES", value: "US", subLabel: "+1" },
];



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
  const [isLoading, setIsLoading] = useState(false);
  
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("Ndenwa Elijah");
  const [email, setEmail] = useState("elijahndenwa19@gmail.com");
  const [phoneCode, setPhoneCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [country, setCountry] = useState("Nigeria");
  const [address, setAddress] = useState("");
  const [hearAbout, setHearAbout] = useState("");

  // Modals state
  const [showCountryModal, setShowCountryModal] = useState(false);

  const [showHearAboutModal, setShowHearAboutModal] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Proceed to main app (tabs)
      // @ts-ignore: bypass strict route typing if it hasn't caught the new tabs directory yet
      router.replace("/(tabs)");
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
          
          {/* Avatar Section */}
          <View className="items-center mt-4 mb-8">
            <TouchableOpacity onPress={pickImage} className="relative">
              <View className="w-28 h-28 rounded-full bg-neutral-100 items-center justify-center border-2 border-transparent overflow-hidden">
                {avatar ? (
                  <Image source={{ uri: avatar }} className="w-full h-full" />
                ) : (
                  <Ionicons name="person-outline" size={48} color="#00B7FF" />
                )}
              </View>
              {/* Camera Badge */}
              <View className="absolute bottom-0 right-1 w-9 h-9 bg-primary-900 rounded-full items-center justify-center border-2 border-white">
                <Ionicons name="camera" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <InputField
            label="Full name"
            placeholder="Enter full name"
            value={fullName}
            onChangeText={setFullName}
          />
          
          <InputField
            label="Email"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View className="mb-4">
            <Text className="body-md font-medium text-neutral-700 mb-1">Phone number</Text>
            <View className="flex-row">
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setShowCountryModal(true)}
                className="flex-row items-center justify-center border border-neutral-300 rounded-xl bg-white px-3 h-14 mr-3"
              >
                <Text className="text-base text-neutral-900 mr-2" style={{ fontFamily: "Poppins-Regular" }}>
                  {phoneCode}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#001328" />
              </TouchableOpacity>
              <View className="flex-1 border border-primary rounded-xl bg-white px-4 h-14 justify-center">
                <Text className="text-base text-neutral-400" style={{ fontFamily: "Poppins-Regular" }}>
                  Enter phone number
                </Text>
              </View>
            </View>
          </View>



          <LocationAutocomplete
            label="Full Address"
            placeholder="Enter Address"
            initialValue={address}
            onSelect={(location) => {
              setAddress(location.display_name);
            }}
          />

          <SelectField
            label="How did you hear about Skilled4U?"
            placeholder="Select an option"
            value={hearAbout}
            onPress={() => setShowHearAboutModal(true)}
            className="mb-8"
          />

          <Button 
            title="Save" 
            onPress={handleSave} 
            isLoading={isLoading} 
          />

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <ModalSelector
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        title="Select Country"
        searchPlaceholder="Search Country"
        options={COUNTRIES}
        onSelect={(val) => {
          const selected = COUNTRIES.find(c => c.value === val);
          if (selected) {
            setCountry(selected.label);
            setPhoneCode(selected.subLabel);
          }
        }}
      />
      

      <ModalSelector
        visible={showHearAboutModal}
        onClose={() => setShowHearAboutModal(false)}
        title="How did you hear about Skilled4U?"
        searchPlaceholder="Search an option"
        options={HEAR_ABOUT_OPTIONS}
        iconName="help-circle-outline"
        onSelect={(val) => {
          const selected = HEAR_ABOUT_OPTIONS.find(h => h.value === val);
          if (selected) setHearAbout(selected.label);
        }}
      />

    </SafeAreaView>
  );
}
