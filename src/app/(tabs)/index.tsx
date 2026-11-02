import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EliteProviders } from "../../components/home/EliteProviders";
import { HomeBanner } from "../../components/home/HomeBanner";
import { HomeHeader } from "../../components/home/HomeHeader";
import { LocationPermissionModal } from "../../components/home/LocationPermissionModal";
import { OurPartners } from "../../components/home/OurPartners";
import { ProductDeals } from "../../components/home/ProductDeals";
import { SearchAndWallet } from "../../components/home/SearchAndWallet";
import { SectionHeader } from "../../components/home/SectionHeader";
import { ServiceCategoryCard } from "../../components/home/ServiceCategoryCard";
import { ServiceSelectionModal } from "../../components/home/ServiceSelectionModal";
import { SpecialPromos } from "../../components/home/SpecialPromos";
import { TrendingProducts } from "../../components/home/TrendingProducts";
import { Category, POPULAR_CATEGORIES } from "../../data/categories";

export default function TabsIndex() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [savedAddress, setSavedAddress] = useState("Wuse 2, Abuja");

  useFocusEffect(
    useCallback(() => {
      const loadSavedLocation = async () => {
        try {
          const raw = await AsyncStorage.getItem("skilled4u_selected_location");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.address) {
              setSavedAddress(parsed.address);
              return;
            }
          }
          const draftRaw = await AsyncStorage.getItem("skilled4u_user_draft");
          if (draftRaw) {
            const draft = JSON.parse(draftRaw);
            if (draft.address) {
              setSavedAddress(draft.address);
            }
          }
        } catch {
          // ignore storage errors
        }
      };
      loadSavedLocation();
    }, [])
  );

  const handleGrantLocation = () => {
    setIsLocationModalVisible(false);
    router.push("/address-book/add");
  };

  const handleSkipLocation = () => {
    setIsLocationModalVisible(false);
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          locationTitle={savedAddress}
          onEditLocation={() => router.push("/address-book/add")}
          onNotificationPress={() => console.log("Notifications")}
        />

        <HomeBanner />
        <SearchAndWallet />

        <SectionHeader title="Popular" onSeeAll={() => router.push("/all-services")} />
        <View className="flex-row flex-wrap justify-between mb-2">
          {POPULAR_CATEGORIES.map((category) => (
            <ServiceCategoryCard
              key={category.id}
              title={category.title}
              iconName={category.iconName}
              iconFamily={category.iconFamily}
              onPress={() => handleCategoryPress(category)}
            />
          ))}
        </View>

        <SectionHeader title="Deals of the Week" onSeeAll={() => console.log("See All Deals")} />
        <ProductDeals />

        <SectionHeader title="Special Promos" onSeeAll={() => console.log("See All Promos")} />
        <SpecialPromos />

        <SectionHeader title="Trending Products" onSeeAll={() => console.log("See All Trending")} />
        <TrendingProducts />

        <SectionHeader title="Elite Providers" onSeeAll={() => console.log("See All Providers")} />
        <EliteProviders />

        <SectionHeader title="Our Partners" showSeeAll={false} />
        <OurPartners />
      </ScrollView>

      <ServiceSelectionModal
        isVisible={isModalVisible}
        category={selectedCategory}
        onClose={() => setIsModalVisible(false)}
        onGoPress={() => {
          if (selectedCategory) {
            router.push(`/service-providers?categoryId=${selectedCategory.id}`);
          }
        }}
      />

      <LocationPermissionModal
        isVisible={isLocationModalVisible}
        onRequestPermission={handleGrantLocation}
        onSkip={handleSkipLocation}
      />
    </SafeAreaView>
  );
}
