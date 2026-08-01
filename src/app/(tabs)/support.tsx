import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUPPORT_LINKS = [
  { id: "1", title: "Quick guide", icon: "color-wand-outline", type: "Ionicons" },
  { id: "2", title: "Contact Us", icon: "phone", type: "Feather" },
  { id: "3", title: "Terms of Use & Privacy Policy", icon: "document-text-outline", type: "Ionicons" },
];

const FAQS = [
  "Is skilled4U Nationwide?",
  "Is it Free?",
  "How do pros get paid?",
  "skilled4U Payment Policy (Nigeria)?",
  "Want to Login/Signup as a Provider?"
];

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-[#1a365d] mb-4">Support</Text>

        <View className="mb-8">
          {SUPPORT_LINKS.map((link) => (
            <TouchableOpacity 
              key={link.id} 
              className="flex-row items-center bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm"
            >
              {link.type === "Ionicons" ? (
                <Ionicons name={link.icon as any} size={20} color="#1a365d" />
              ) : (
                <Feather name={link.icon as any} size={20} color="#1a365d" />
              )}
              <Text className="text-[15px] font-medium text-[#1a365d] ml-3">{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-2xl font-bold text-[#1a365d] mb-4">FAQs</Text>

        <View className="mb-8">
          {FAQS.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <View key={index} className="bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4"
                  onPress={() => setExpandedFaq(isExpanded ? null : index)}
                >
                  <Text className="text-[15px] font-medium text-[#1a365d] flex-1 mr-4">{faq}</Text>
                  <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#1a365d" />
                </TouchableOpacity>
                {isExpanded && (
                  <View className="px-4 pb-4 pt-1">
                    <Text className="text-gray-500 text-sm leading-5">
                      Yes, skilled4U connects users with professionals across the nation. (Dummy content to show the expanded state)
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        {/* Extra padding at bottom for scroll breathing room */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
