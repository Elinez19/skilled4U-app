import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ALL_CATEGORIES } from '../data/categories';

export default function AllServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [selectedSubServices, setSelectedSubServices] = useState<Record<string, boolean>>({});

  const filteredCategories = ALL_CATEGORIES.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryId(prev => (prev === categoryId ? null : categoryId));
  };

  const toggleSubService = (subService: string) => {
    setSelectedSubServices(prev => ({
      ...prev,
      [subService]: !prev[subService]
    }));
  };

  const handleGo = () => {
    if (expandedCategoryId) {
      router.push(`/service-providers?categoryId=${expandedCategoryId}`);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <View className="px-5 pt-2 pb-4">
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} className="mb-4 mt-2">
          <Ionicons name="arrow-back" size={28} color="#0D253C" />
        </TouchableOpacity>
        
        <Text className="text-[22px] font-bold text-[#0D253C] mb-4">All Services</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100 mb-2">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search Services"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-slate-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        >
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategoryId === category.id;

            return (
              <View 
                key={category.id}
                className="bg-white rounded-xl mb-3"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 }}
              >
                <TouchableOpacity 
                  className="flex-row items-center p-4"
                  onPress={() => toggleCategory(category.id)}
                >
                  <Ionicons name={category.iconName as any} size={20} color="#00B7FF" />
                  <Text className="ml-4 flex-1 text-[15px] text-slate-700 font-medium">
                    {category.title}
                  </Text>
                  {isExpanded && (
                    <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
                  )}
                </TouchableOpacity>

                {isExpanded && category.subServices && (
                  <View className="px-4 pb-4 pt-1 ml-9">
                    {category.subServices.map((sub, idx) => {
                      const isSelected = selectedSubServices[sub];
                      return (
                        <TouchableOpacity 
                          key={idx} 
                          className="flex-row items-center py-2.5"
                          onPress={() => toggleSubService(sub)}
                        >
                          <View 
                            className={`w-4 h-4 rounded-sm border items-center justify-center mr-4 ${isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-400 bg-white'}`}
                          >
                            {isSelected && <Ionicons name="checkmark" size={12} color="white" />}
                          </View>
                          <Text className="text-[14px] text-slate-600">
                            {sub}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Floating Go Button */}
        <TouchableOpacity 
          style={{ position: 'absolute', bottom: 30, right: 20, shadowColor: '#00B7FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
          className="bg-primary flex-row items-center justify-center px-6 py-3.5 rounded-full"
          onPress={handleGo}
        >
          <Text className="text-white font-medium text-lg mr-2">Go</Text>
          <Ionicons name="arrow-forward-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
