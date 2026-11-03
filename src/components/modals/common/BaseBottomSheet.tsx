import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  DimensionValue,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface BaseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxHeight?: DimensionValue;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  scrollable?: boolean;
  showHandle?: boolean;
  contentContainerClassName?: string;
}

export function BaseBottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  maxHeight = "88%",
  children,
  headerRight,
  scrollable = false,
  showHandle = true,
  contentContainerClassName = "bg-white",
}: BaseBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Backdrop touch to dismiss */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Bottom Sheet Card */}
        <View
          style={[styles.modalSheet, { maxHeight }]}
          className={`${contentContainerClassName} rounded-t-4xl overflow-hidden`}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoid}
          >
            {/* Drag Handle */}
            {showHandle && (
              <View className="items-center pt-3 pb-1">
                <View className="w-12 h-1.5 rounded-full bg-[#D6ECFA]" />
              </View>
            )}

            {/* Optional Header */}
            {(title || headerRight) && (
              <View className="flex-row items-center justify-between px-5 pt-3 pb-2 border-b border-[#F0F6FA]">
                <View className="flex-1 mr-3">
                  {title && (
                    <Text
                      className="text-[19px] text-[#003B73]"
                      style={{ fontFamily: "Poppins-Bold" }}
                      numberOfLines={1}
                    >
                      {title}
                    </Text>
                  )}
                  {subtitle && (
                    <Text
                      className="text-[12px] text-[#5B7C99] mt-0.5"
                      style={{ fontFamily: "Poppins-Regular" }}
                      numberOfLines={1}
                    >
                      {subtitle}
                    </Text>
                  )}
                </View>

                <View className="flex-row items-center">
                  {headerRight}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onClose}
                    className="w-8 h-8 rounded-full bg-[#F0F7FC] items-center justify-center ml-2 border border-[#DCEFFB]"
                  >
                    <Ionicons name="close" size={18} color="#003B73" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Content */}
            {scrollable ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>
            ) : (
              <View style={styles.fixedContent}>{children}</View>
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 31, 63, 0.48)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    width: "100%",
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    width: "100%",
  },
  scrollView: {
    flexGrow: 0,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  fixedContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
});
