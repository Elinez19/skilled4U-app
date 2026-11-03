import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

export interface ReviewSubmission {
  bookingId: string;
  rating: number;
  tags: string[];
  comment: string;
  tipAmount: number;
}

interface ServiceRatingModalProps {
  visible: boolean;
  bookingId?: string;
  artisanName?: string;
  artisanTrade?: string;
  artisanAvatar?: ImageSourcePropType;
  onClose: () => void;
  onSubmitReview: (data: ReviewSubmission) => void;
}

const REVIEW_TAGS = [
  "Punctual",
  "Neat Work",
  "Very Polite",
  "Professional Tools",
  "Fair Price",
  "Highly Skilled",
];

const TIP_OPTIONS = [0, 500, 1000, 2000];

export function ServiceRatingModal({
  visible,
  bookingId = "bk-01",
  artisanName = "Emeka Okafor",
  artisanTrade = "Plumber",
  artisanAvatar,
  onClose,
  onSubmitReview,
}: ServiceRatingModalProps) {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Punctual", "Neat Work"]);
  const [comment, setComment] = useState("");
  const [selectedTip, setSelectedTip] = useState(1000);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmitReview({
      bookingId,
      rating,
      tags: selectedTags,
      comment,
      tipAmount: selectedTip,
    });
    onClose();
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Rate & Review"
      subtitle="How was your service experience?"
      scrollable
      maxHeight="90%"
    >
      {/* Service Completed Header */}
      <View className="items-center mb-4">
        {artisanAvatar ? (
          <Image
            source={artisanAvatar}
            className="w-16 h-16 rounded-full bg-[#E6F7FF] mb-2 border-2 border-[#00A8E8]"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-[#E6F7FF] items-center justify-center mb-2 border-2 border-[#00A8E8]">
            <Ionicons name="checkmark-done" size={28} color="#00A8E8" />
          </View>
        )}
        <Text
          className="text-[17px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          {artisanName}
        </Text>
        <Text
          className="text-[12px] text-[#5B7C99]"
          style={{ fontFamily: "Poppins-Medium" }}
        >
          {artisanTrade} • Job Completed
        </Text>
      </View>

      {/* 5-Star Interactive Rating */}
      <View className="flex-row justify-center items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => setRating(star)}
            className="p-1.5"
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={36}
              color={star <= rating ? "#F59E0B" : "#CBD5E1"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Tag Compliments */}
      <Text
        className="text-[13px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        What went well?
      </Text>
      <View className="flex-row flex-wrap mb-4">
        {REVIEW_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              activeOpacity={0.75}
              onPress={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full mr-2 mb-2 border ${
                isSelected
                  ? "bg-[#E6F7FF] border-[#00A8E8]"
                  : "bg-white border-[#D6ECFA]"
              }`}
            >
              <Text
                className={`text-[12px] ${
                  isSelected ? "text-[#00A8E8]" : "text-[#5B7C99]"
                }`}
                style={{
                  fontFamily: isSelected ? "Poppins-SemiBold" : "Poppins-Regular",
                }}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Written Feedback */}
      <Text
        className="text-[13px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Leave a note for the community
      </Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Describe how the artisan performed the work..."
        placeholderTextColor="#9BB7CF"
        multiline
        numberOfLines={3}
        className="bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl p-3 text-[13px] text-[#003B73] mb-4"
        style={{ fontFamily: "Poppins-Regular", height: 70, textAlignVertical: "top" }}
      />

      {/* Add Tip */}
      <Text
        className="text-[13px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Add a Tip for {artisanName.split(" ")[0]}?
      </Text>
      <View className="flex-row mb-5">
        {TIP_OPTIONS.map((tip) => {
          const isSelected = selectedTip === tip;
          return (
            <TouchableOpacity
              key={tip}
              activeOpacity={0.8}
              onPress={() => setSelectedTip(tip)}
              className={`flex-1 py-2.5 rounded-2xl items-center mr-2 border ${
                isSelected
                  ? "bg-[#003B73] border-[#003B73]"
                  : "bg-[#F4FAFF] border-[#DCEFFB]"
              }`}
            >
              <Text
                className={`text-[12px] ${
                  isSelected ? "text-white" : "text-[#003B73]"
                }`}
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {tip === 0 ? "No tip" : `₦${tip}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSubmit}
        className="w-full bg-[#00A8E8] py-3.5 rounded-full items-center shadow-sm"
      >
        <Text
          className="text-[14.5px] text-white"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Submit Review & Release Escrow
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  );
}

