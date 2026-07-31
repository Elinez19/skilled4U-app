import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export function SectionHeader({ title, onSeeAll, showSeeAll = true }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4 mt-2">
      <Text className="text-xl font-bold text-neutral-800" style={{ fontFamily: "Poppins-SemiBold" }}>
        {title}
      </Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onSeeAll} className="flex-row items-center">
          <Text className="text-sm font-medium mr-1 text-[#00B7FF]">See All</Text>
          <Ionicons name="chevron-forward" size={16} color="#00B7FF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
