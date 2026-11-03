import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Artisan } from "../../../data/artisans";

interface ArtisanQuickViewModalProps {
  visible: boolean;
  artisan: Artisan | null;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClose: () => void;
  onBookNow: (artisan: Artisan) => void;
  onSendMessage?: (artisan: Artisan) => void;
}

export function ArtisanQuickViewModal({
  visible,
  artisan,
  isFavorite = false,
  onToggleFavorite,
  onClose,
  onBookNow,
  onSendMessage,
}: ArtisanQuickViewModalProps) {
  if (!artisan) return null;

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

        {/* Modal Sheet Card */}
        <View
          style={styles.modalSheet}
          className="bg-white rounded-t-4xl overflow-hidden"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flexGrow: 0 }}
          >
                {/* Portrait Header with Back, Favorite & Verified Badge */}
                <View className="w-full h-56 bg-primary-50 relative">
                  <Image
                    source={artisan.avatarSource}
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  {/* Close / Back button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onClose}
                    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 items-center justify-center border border-[#D6ECFA]"
                  >
                    <Ionicons name="arrow-back" size={20} color="#003B73" />
                  </TouchableOpacity>

                  {/* Favorite button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onToggleFavorite && onToggleFavorite(artisan.id)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 items-center justify-center border border-[#D6ECFA]"
                  >
                    <Ionicons
                      name={isFavorite ? "heart" : "heart-outline"}
                      size={20}
                      color={isFavorite ? "#EF4444" : "#003B73"}
                    />
                  </TouchableOpacity>

                  {/* Floating Verified Badge */}
                  <View className="absolute top-16 right-4 bg-white/95 px-3 py-1 rounded-full flex-row items-center border border-[#D6ECFA]">
                    <Ionicons name="shield-checkmark" size={14} color="#00A8E8" />
                    <Text
                      className="text-[11.5px] text-[#003B73] ml-1"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Verified
                    </Text>
                  </View>
                </View>

                {/* Profile Details Container */}
                <View className="px-5 pt-4 pb-8">
                  {/* Name & Hourly Rate */}
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-[22px] text-[#003B73] flex-1 mr-2"
                      style={{ fontFamily: "Poppins-Bold" }}
                      numberOfLines={1}
                    >
                      {artisan.name}
                    </Text>
                    <Text
                      className="text-[17px] text-[#00A8E8]"
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {artisan.hourlyRate}
                      <Text
                        className="text-[12px] text-[#7A9BB8]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        /hr
                      </Text>
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-0.5 mb-2">
                    <Ionicons name="construct-outline" size={16} color="#00A8E8" />
                    <Text
                      className="text-[14px] text-[#5B7C99] ml-1"
                      style={{ fontFamily: "Poppins-Medium" }}
                    >
                      {artisan.trade}
                    </Text>
                  </View>

                  {/* Rating & Distance Row */}
                  <View className="flex-row items-center justify-between mb-3.5">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text
                        className="text-[14px] text-[#003B73] ml-1"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        {artisan.rating}
                      </Text>
                      <Text
                        className="text-[13px] text-[#5B7C99] ml-1"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        ({artisan.reviews} reviews)
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Ionicons
                        name="location-outline"
                        size={15}
                        color="#5B7C99"
                      />
                      <Text
                        className="text-[13px] text-[#5B7C99] ml-1"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        {artisan.distance} away
                      </Text>
                    </View>
                  </View>

                  {/* Verification Badges */}
                  <View className="flex-row flex-wrap mb-4">
                    <View className="flex-row items-center bg-[#E8F8F0] border border-[#B2F0D2] px-2.5 py-1 rounded-full mr-2 mb-1.5">
                      <Ionicons
                        name="shield-checkmark"
                        size={13}
                        color="#10B981"
                      />
                      <Text
                        className="text-[11px] text-[#059669] ml-1"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Verified
                      </Text>
                    </View>

                    <View className="flex-row items-center bg-[#EBF7FF] border border-[#C6E6FC] px-2.5 py-1 rounded-full mr-2 mb-1.5">
                      <Ionicons
                        name="checkmark-done-circle"
                        size={13}
                        color="#0099DF"
                      />
                      <Text
                        className="text-[11px] text-[#003B73] ml-1"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Background Checked
                      </Text>
                    </View>

                    <View className="flex-row items-center bg-[#EBF7FF] border border-[#C6E6FC] px-2.5 py-1 rounded-full mb-1.5">
                      <Ionicons name="ribbon" size={13} color="#0099DF" />
                      <Text
                        className="text-[11px] text-[#003B73] ml-1"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Insured
                      </Text>
                    </View>
                  </View>

                  {/* About Section */}
                  <Text
                    className="text-[15px] text-[#003B73] mb-1"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    About
                  </Text>
                  <Text
                    className="text-[13px] text-[#5B7C99] mb-3.5"
                    style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
                  >
                    {artisan.about}
                  </Text>

                  {/* Skill Chips */}
                  <View className="flex-row flex-wrap mb-4">
                    {artisan.skills.map((skill) => (
                      <View
                        key={skill}
                        className="bg-[#F0F9FF] border border-[#D6ECFA] px-3.5 py-1.5 rounded-full mr-2 mb-2"
                      >
                        <Text
                          className="text-[12px] text-[#003B73]"
                          style={{ fontFamily: "Poppins-Medium" }}
                        >
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Recent Work Portfolio */}
                  {artisan.recentWork && artisan.recentWork.length > 0 && (
                    <>
                      <Text
                        className="text-[15px] text-[#003B73] mb-2"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        Recent Work
                      </Text>
                      <View className="flex-row justify-between mb-5">
                        {artisan.recentWork.slice(0, 3).map((workImg, idx) => (
                          <View
                            key={idx}
                            style={{ width: "31.5%" }}
                            className="h-24 rounded-xl overflow-hidden bg-primary-50 border border-[#DCEFFB]"
                          >
                            <Image
                              source={workImg}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </View>
                        ))}
                      </View>
                    </>
                  )}

                  {/* Action Buttons: Message & Book Appointment */}
                  <View className="flex-row items-center space-x-3">
                    {onSendMessage && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onSendMessage(artisan)}
                        className="w-13 h-13 rounded-full bg-[#EBF7FF] border border-[#C6E6FC] items-center justify-center mr-3"
                      >
                        <Ionicons
                          name="chatbubble-ellipses-outline"
                          size={22}
                          color="#00A8E8"
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => onBookNow(artisan)}
                      style={styles.bookBtnShadow}
                      className="flex-1 bg-primary py-3.5 rounded-full items-center"
                    >
                      <Text
                        className="text-[15px] text-white"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Book Appointment
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
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
    maxHeight: "90%",
    backgroundColor: "#ffffff",
  },
  bookBtnShadow: Platform.select({
    ios: {
      shadowColor: "#00A8E8",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
});

