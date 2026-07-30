import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Category } from '../../data/categories';

interface BookServiceModalProps {
  isVisible: boolean;
  onClose: () => void;
  category?: Category;
}

export function BookServiceModal({ isVisible, onClose, category }: BookServiceModalProps) {
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const [taskDetails, setTaskDetails] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const toggleService = (service: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const subServices = category?.subServices || [];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ maxHeight: '95%' }}
        >
          <View className="bg-white rounded-t-[30px] p-6 pt-8">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="text-[18px] font-bold text-[#0D253C]">What Service do you need?</Text>
                <Text className="text-[13px] text-slate-500 mt-1">Choose as many as desired</Text>
              </View>
              <TouchableOpacity onPress={onClose} className="p-1">
                <Ionicons name="close-circle-outline" size={26} color="#0D253C" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mt-2">
              {/* Checkboxes */}
              <View className="mb-6">
                {subServices.map((sub, idx) => {
                  const isSelected = selectedServices[sub];
                  return (
                    <TouchableOpacity 
                      key={idx}
                      className="flex-row items-center py-2.5"
                      onPress={() => toggleService(sub)}
                    >
                      <View className={`w-5 h-5 rounded-[4px] border items-center justify-center mr-4 ${isSelected ? 'border-[#0D253C] bg-[#0D253C]' : 'border-slate-400 bg-white'}`}>
                        {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                      </View>
                      <Text className="text-[15px] text-[#0D253C]">{sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Task Details */}
              <View className="mb-5">
                <Text className="text-[14px] text-[#0D253C] font-medium mb-2">
                  Share additional details about your task <Text className="text-slate-300 font-normal">(Optional)</Text>
                </Text>
                <TextInput
                  className="border border-slate-200 rounded-xl p-4 text-[14px] text-slate-700 bg-white"
                  placeholder="Enter your note"
                  placeholderTextColor="#CBD5E1"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={taskDetails}
                  onChangeText={setTaskDetails}
                  style={{ height: 100 }}
                />
              </View>

              {/* Promo Code */}
              <View className="mb-6">
                <Text className="text-[14px] text-[#0D253C] font-medium mb-2">Have a promo code?</Text>
                <View className="flex-row h-12">
                  <TextInput
                    className="flex-1 border border-slate-200 rounded-xl px-4 text-[14px] text-slate-700 bg-white mr-3"
                    placeholder="Enter your note" 
                    placeholderTextColor="#CBD5E1"
                    value={promoCode}
                    onChangeText={setPromoCode}
                  />
                  <TouchableOpacity className="border border-cyan-100 rounded-xl px-8 justify-center items-center">
                    <Text className="text-[#00B7FF] font-medium text-[14px]">Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Actions */}
              <TouchableOpacity className="w-full bg-[#00B7FF] rounded-xl py-3.5 items-center mb-3">
                <Text className="text-white font-medium text-[15px]">Immediate Service Request</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="w-full bg-[#2541B2] rounded-xl py-3.5 items-center mb-8"
                onPress={() => {
                  onClose();
                  router.push('/schedule-appointment');
                }}
              >
                <Text className="text-white font-medium text-[15px]">Schedule Appointment</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
