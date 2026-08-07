import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface LocationPermissionModalProps {
  isVisible: boolean;
  onRequestPermission: () => void;
  onSkip: () => void;
}

export function LocationPermissionModal({ isVisible, onRequestPermission, onSkip }: LocationPermissionModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onSkip}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 items-center">
          <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="location" size={32} color="#2563eb" />
          </View>
          
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: "Poppins-SemiBold" }}>
            Enable Location
          </Text>
          
          <Text className="text-gray-600 text-center mb-8 px-4" style={{ fontFamily: "Poppins-Regular" }}>
            We need your location to show you the best artisans and services available in your area.
          </Text>

          <TouchableOpacity 
            className="w-full bg-primary-600 py-4 rounded-xl mb-3"
            onPress={onRequestPermission}
          >
            <Text className="text-white text-center font-bold text-lg" style={{ fontFamily: "Poppins-Medium" }}>
              Allow Location Access
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full py-4 rounded-xl"
            onPress={onSkip}
          >
            <Text className="text-gray-500 text-center font-semibold text-lg" style={{ fontFamily: "Poppins-Medium" }}>
              Not Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
