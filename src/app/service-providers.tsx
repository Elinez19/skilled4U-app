import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookServiceModal } from '../components/providers/BookServiceModal';
import { images } from '../constants/images';
import { ARTISANS } from '../data/artisans';
import { ALL_CATEGORIES } from '../data/categories';

export default function ServiceProvidersScreen() {
  const { categoryId } = useLocalSearchParams();
  const [isBookModalVisible, setIsBookModalVisible] = useState(false);
  const category = ALL_CATEGORIES.find(c => c.id === categoryId);
  const title = category?.title || 'Services';

  const providers = ARTISANS.filter(a => a.categoryId === categoryId);
  const displayProviders = providers.length > 0 ? providers : ARTISANS;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-5 pt-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-4 mt-2">
            <Ionicons name="chevron-back" size={28} color="#0D253C" />
          </TouchableOpacity>
          
          <Text className="text-[15px] font-semibold text-slate-600">
            Abuja Municipal Area Council, Ankuru
          </Text>
          <TouchableOpacity>
            <Text className="text-[#00B7FF] text-[13px] mt-1 mb-6">Edit service location</Text>
          </TouchableOpacity>

          <Text className="text-[18px] font-bold text-[#0D253C] mb-4">
            {title} Around You
          </Text>
        </View>

        {/* Banner */}
        <View className="px-5 mb-6">
          <Image 
            source={images.banner} 
            className="w-full h-32 rounded-xl"
            resizeMode="cover"
          />
          <View className="flex-row justify-center mt-3">
            <View className="w-1.5 h-1.5 rounded-full bg-slate-600 mx-1" />
            <View className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-1" />
            <View className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-1" />
          </View>
        </View>

        {/* Providers List */}
        <View className="px-5">
          {displayProviders.map((provider) => (
            <View 
              key={provider.id}
              className="bg-white rounded-[20px] p-5 mb-4 border border-primary"
            >
              <Text className="text-right text-[11px] text-slate-500 mb-3 font-medium">Closest to you</Text>
              
              <View className="flex-row items-center mb-5">
                <View className="relative mr-4">
                  <Image 
                    source={{ uri: provider.profileImage }} 
                    className="w-15 h-15 rounded-full bg-slate-200"
                  />
                  {provider.isOnline && (
                    <View className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#10B981] border-[2.5px] border-white" />
                  )}
                </View>
                
                <View>
                  <Text className="text-[17px] font-bold text-[#0D253C] mb-1.5">{provider.name}</Text>
                  <View className="flex-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome 
                        key={star}
                        name="star" 
                        size={13} 
                        color={star <= provider.rating ? "#00B7FF" : "#D1D5DB"} 
                        style={{ marginRight: 3 }}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View className="flex-row justify-between">
                <TouchableOpacity className="flex-1 bg-primary rounded-full py-3 items-center mr-2">
                  <Text className="text-white font-medium text-[14px]">View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 bg-[#1E3A8A] rounded-full py-3 items-center ml-2"
                  onPress={() => setIsBookModalVisible(true)}
                >
                  <Text className="text-white font-medium text-[14px]">Book Service</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BookServiceModal 
        isVisible={isBookModalVisible} 
        onClose={() => setIsBookModalVisible(false)} 
        category={category} 
      />
    </SafeAreaView>
  );
}
