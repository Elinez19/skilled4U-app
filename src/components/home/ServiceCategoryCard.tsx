import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

interface ServiceCategoryCardProps {
  title: string;
  iconName: string;
  iconFamily: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
}

export function ServiceCategoryCard({ title, iconName, iconFamily, onPress }: ServiceCategoryCardProps) {
  const renderIcon = () => {
    switch (iconFamily) {
      case "Ionicons":
        return <Ionicons name={iconName as any} size={40} color="#0066FF" />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={iconName as any} size={40} color="#0066FF" />;
      case "FontAwesome5":
        return <FontAwesome5 name={iconName as any} size={36} color="#0066FF" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-white border border-neutral-100 rounded-2xl p-4 items-center justify-center mb-4 w-[48%]"
      style={styles.cardShadow}
    >
      <View className="h-20 items-center justify-center relative w-full mb-3">
        {/* Background Blob Mockup (Using a simple oval for now) */}
        <View className="absolute bg-[#FFF8E7] w-24 h-16 rounded-full transform -rotate-12" />
        
        {/* Icon on top of blob */}
        <View className="z-10 mt-2">
          {renderIcon()}
        </View>
      </View>
      
      <Text 
        className="text-center text-sm font-medium text-neutral-800 px-1" 
        style={{ fontFamily: "Poppins-Medium" }}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  }
});
