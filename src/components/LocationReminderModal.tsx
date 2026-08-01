import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LocationReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onEnable: () => void;
}

export function LocationReminderModal({ visible, onClose, onEnable }: LocationReminderModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View className="bg-white rounded-3xl w-85 p-6 items-center shadow-lg">
          <Text className="body-md text-[#001328] text-center mb-8 px-2 leading-6">
            Location services are turned off. Please enable GPS to get your current location.
          </Text>

          <View className="flex-row items-center justify-between w-full">
            <TouchableOpacity 
              onPress={onClose}
              className="flex-1 bg-neutral-100 h-12 rounded-full items-center justify-center mr-2"
            >
              <Text className="text-neutral-500 font-medium text-[15px]">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onEnable}
              className="flex-1 bg-primary h-12 rounded-full items-center justify-center ml-2"
            >
              <Text className="text-white font-medium text-[15px]">Enable GPS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  }
});
