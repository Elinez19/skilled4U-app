import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../constants/images";

const BRANDS = ["All", "LG", "Hisense", "Scanfrost", "Bruhm", "Kanion", "Panasonic"];

const getStoreData = (categoryTitle: string) => {
  const isPaints = categoryTitle === "Paints";
  
  let products = [];
  let imageSource = images.paintBucket;
  let description = "We are a one stop shop for all things. We deliver if needed.";
  
  if (categoryTitle === "Washing Machines") {
    imageSource = images.washingMachine;
    description = "Top quality washing machines for all your laundry needs.";
    products = [
      { id: 1, title: "LG Top Load 8KG", price: "185,000.00", priceValue: 185000, brand: "LG", image: imageSource },
      { id: 2, title: "Hisense Front Load 10KG", price: "245,000.00", priceValue: 245000, brand: "Hisense", image: imageSource },
      { id: 3, title: "Scanfrost Twin Tub", price: "115,000.00", priceValue: 115000, brand: "Scanfrost", image: imageSource },
      { id: 4, title: "Panasonic 7KG", price: "160,000.00", priceValue: 160000, brand: "Panasonic", image: imageSource },
    ];
  } else if (categoryTitle === "Refrigerators") {
    imageSource = images.refrigerator;
    description = "Cool your items with our premium selection of refrigerators.";
    products = [
      { id: 1, title: "Hisense Double Door", price: "320,000.00", priceValue: 320000, brand: "Hisense", image: imageSource },
      { id: 2, title: "LG Side by Side", price: "850,000.00", priceValue: 850000, brand: "LG", image: imageSource },
      { id: 3, title: "Scanfrost Chest Freezer", price: "210,000.00", priceValue: 210000, brand: "Scanfrost", image: imageSource },
    ];
  } else if (categoryTitle === "Air Conditioners") {
    imageSource = images.airConditioner;
    description = "Stay cool with our energy-efficient AC units.";
    products = [
      { id: 1, title: "LG Split 1.5HP", price: "295,000.00", priceValue: 295000, brand: "LG", image: imageSource },
      { id: 2, title: "Kanion 1HP Split", price: "185,000.00", priceValue: 185000, brand: "Kanion", image: imageSource },
      { id: 3, title: "Panasonic 2HP", price: "380,000.00", priceValue: 380000, brand: "Panasonic", image: imageSource },
    ];
  } else if (categoryTitle === "Inverters/ Generators") {
    imageSource = images.generator;
    description = "Reliable power backup solutions for your home and office.";
    products = [
      { id: 1, title: "Generic 3.5KVA Generator", price: "145,000.00", priceValue: 145000, brand: "All", image: imageSource },
      { id: 2, title: "Luminous 2KVA Inverter", price: "180,000.00", priceValue: 180000, brand: "All", image: imageSource },
    ];
  } else if (categoryTitle === "Small Appliances") {
    imageSource = images.smallAppliances;
    description = "Blenders, microwaves, and more everyday small appliances.";
    products = [
      { id: 1, title: "Hisense Microwave", price: "45,000.00", priceValue: 45000, brand: "Hisense", image: imageSource },
      { id: 2, title: "Scanfrost Blender", price: "25,000.00", priceValue: 25000, brand: "Scanfrost", image: imageSource },
    ];
  } else if (categoryTitle === "Cooking Appliances") {
    imageSource = images.cookingAppliances;
    description = "Gas cookers, air fryers and electric stoves.";
    products = [
      { id: 1, title: "Bruhm Gas Cooker", price: "195,000.00", priceValue: 195000, brand: "Bruhm", image: imageSource },
      { id: 2, title: "Scanfrost Table Top Gas", price: "35,000.00", priceValue: 35000, brand: "Scanfrost", image: imageSource },
    ];
  } else if (categoryTitle === "Internet/ Phone") {
    imageSource = images.internetRouter;
    description = "Stay connected with routers and networking gear.";
    products = [
      { id: 1, title: "4G WiFi Router", price: "32,000.00", priceValue: 32000, brand: "All", image: imageSource },
    ];
  } else {
    // Default / Paints
    products = [
      { id: 1, title: "Emulsion 4 Ltrs", price: "4,500.00", priceValue: 4500, brand: "LG", image: images.paintBucket },
      { id: 2, title: "Value Plus Emul 4Ltrs", price: "9,100.00", priceValue: 9100, brand: "Hisense", image: images.paintBucket },
      { id: 3, title: "Satin 4 Ltrs", price: "7,500.00", priceValue: 7500, brand: "Scanfrost", image: images.paintBucket },
      { id: 4, title: "Matt 4 Ltrs", price: "8,200.00", priceValue: 8200, brand: "Bruhm", image: images.paintBucket },
    ];
    description = "We are a one stop shop for all things painting. We sell quality paints and other accessories such as Wallpaper, paint brushes, rollers and screeding materials. etc.\n\nWe deliver if needed.";
  }

  return { products, description, storeName: `skilled4U ${categoryTitle} Store` };
};

export default function MarketStoreScreen() {
  const { category } = useLocalSearchParams();
  const categoryTitle = (category as string) || "Paints";
  
  const { products, description, storeName } = getStoreData(categoryTitle);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Default"); // Default, LowToHigh, HighToLow
  const [selectedBrand, setSelectedBrand] = useState("All");

  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  }).sort((a, b) => {
    if (sortBy === "LowToHigh") return a.priceValue - b.priceValue;
    if (sortBy === "HighToLow") return b.priceValue - a.priceValue;
    return 0; // Default
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="#0F2846" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Info */}
        <View className="flex-row items-center mb-6">
          <View className="w-16 h-16 rounded-full bg-[#00B7FF] items-center justify-center mr-4">
            <Text className="text-white font-bold text-3xl">W</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[#0F2846] font-bold text-lg mb-1">{storeName}</Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={14} color="#0A58FF" />
              <Text className="text-gray-500 text-xs ml-1 flex-1">Obalende, Ikoyi, Lagos, Nigeria</Text>
            </View>
          </View>
        </View>

        <View className="h-[1px] w-full bg-gray-200 mb-6" />

        {/* Description */}
        <Text className="text-[#0F2846] text-sm leading-5 mb-6">
          {description}
        </Text>

        {/* Contact Button */}
        <TouchableOpacity className="w-full bg-[#00B7FF] rounded-xl py-3.5 items-center mb-6" activeOpacity={0.8}>
          <Text className="text-white font-semibold text-base">Contact Store</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-[#0F2846]"
          />
        </View>

        {/* Filters */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity 
            onPress={() => setIsSortModalVisible(true)}
            className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-white flex-1 mr-2 justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="swap-vertical" size={16} color="#0F2846" />
              <Text className="text-[#0F2846] text-sm mx-2">Sort by Price</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#0F2846" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsBrandModalVisible(true)}
            className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-white flex-1 ml-2 justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="grid-outline" size={16} color="#0F2846" />
              <Text className="text-[#0F2846] text-sm mx-2">Brand</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#0F2846" />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <View className="flex-row flex-wrap justify-between">
          {filteredProducts.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              onPress={() => router.push({
                pathname: '/market-product',
                params: {
                  title: product.title,
                  price: product.price,
                  imageKey: categoryTitle
                }
              })}
              className="w-[48%] bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden"
              activeOpacity={0.7}
            >
              <View className="w-full h-32 bg-gray-100 items-center justify-center p-2">
                <Image 
                  source={product.image} 
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
              <View className="p-3">
                <Text className="text-[#0F2846] text-xs font-medium mb-1" numberOfLines={1}>
                  {product.title}
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[#0F2846] font-bold text-sm">
                    ₦ {product.price}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#0F2846" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {filteredProducts.length === 0 && (
            <View className="w-full py-8 items-center">
              <Text className="text-gray-500">No items found.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sort Modal */}
      <Modal visible={isSortModalVisible} transparent animationType="slide">
        <TouchableOpacity 
          className="flex-1 justify-end bg-black/50" 
          activeOpacity={1} 
          onPress={() => setIsSortModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="bg-white rounded-t-3xl p-6 min-h-[300px]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[#0F2846] font-bold text-xl">Sort by Price</Text>
              <TouchableOpacity onPress={() => setIsSortModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0F2846" />
              </TouchableOpacity>
            </View>
            
            {[
              { label: "Default", value: "Default" }, 
              { label: "Price: Low → High", value: "LowToHigh" }, 
              { label: "Price: High → Low", value: "HighToLow" }
            ].map((option) => {
               const isSelected = sortBy === option.value;
               return (
                 <TouchableOpacity 
                   key={option.value} 
                   className="flex-row justify-between items-center py-4"
                   onPress={() => { setSortBy(option.value); setIsSortModalVisible(false); }}
                 >
                   <Text className={`text-base ${isSelected ? 'text-[#00B7FF] font-medium' : 'text-[#0F2846]'}`}>
                     {option.label}
                   </Text>
                   {isSelected && <Ionicons name="checkmark" size={20} color="#00B7FF" />}
                 </TouchableOpacity>
               );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Brand Modal */}
      <Modal visible={isBrandModalVisible} transparent animationType="slide">
        <TouchableOpacity 
          className="flex-1 justify-end bg-black/50" 
          activeOpacity={1} 
          onPress={() => setIsBrandModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="bg-white rounded-t-3xl p-6 h-[500px]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[#0F2846] font-bold text-xl">Brand</Text>
              <TouchableOpacity onPress={() => setIsBrandModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0F2846" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {BRANDS.map((brand) => {
                 const isSelected = selectedBrand === brand;
                 return (
                   <TouchableOpacity 
                     key={brand} 
                     className="flex-row justify-between items-center py-4"
                     onPress={() => { setSelectedBrand(brand); setIsBrandModalVisible(false); }}
                   >
                     <Text className={`text-base ${isSelected ? 'text-[#00B7FF] font-medium' : 'text-[#0F2846]'}`}>
                       {brand}
                     </Text>
                     {isSelected && <Ionicons name="checkmark" size={20} color="#00B7FF" />}
                   </TouchableOpacity>
                 );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
