import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArtisanJobRequest } from "../../../data/artisans";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

interface JobLeadDetailsModalProps {
  visible: boolean;
  job: ArtisanJobRequest | null;
  onClose: () => void;
  onAcceptJob: (job: ArtisanJobRequest) => void;
  onRequestCustomQuote: (job: ArtisanJobRequest) => void;
  isApplied?: boolean;
}

export function JobLeadDetailsModal({
  visible,
  job,
  onClose,
  onAcceptJob,
  onRequestCustomQuote,
  isApplied = false,
}: JobLeadDetailsModalProps) {
  if (!job) return null;

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Job Details"
      subtitle={job.serviceType}
      scrollable
      maxHeight="92%"
    >
      {/* Problem Image Preview */}
      <View className="w-full h-44 rounded-2xl overflow-hidden bg-[#E6F7FF] mb-4 border border-[#DCEFFB]">
        <Image
          source={job.detailImage || job.image}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Title & Budget */}
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="text-[18px] text-[#003B73] flex-1 mr-2"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          {job.title}
        </Text>
        <Text
          className="text-[18px] text-[#00A8E8]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          {job.budget}
        </Text>
      </View>

      {/* Location & Posted Time */}
      <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-[#F0F6FA]">
        <View className="flex-row items-center">
          <Ionicons name="location" size={15} color="#00A8E8" />
          <Text
            className="text-[12.5px] text-[#5B7C99] ml-1"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            {job.distance} away
          </Text>
        </View>

        <Text
          className="text-[12px] text-[#7A9BB8]"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          Posted {job.postedAgo}
        </Text>
      </View>

      {/* Client Profile Snippet */}
      <View className="bg-[#F8FCFF] border border-[#D6ECFA] p-3 rounded-2xl mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          <Image
            source={job.client.avatar}
            className="w-11 h-11 rounded-full bg-[#E6F7FF]"
            resizeMode="cover"
          />
          <View className="ml-2.5 flex-1">
            <Text
              className="text-[13.5px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
              numberOfLines={1}
            >
              {job.client.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text
                className="text-[12px] text-[#003B73] ml-1"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {job.client.rating}
              </Text>
              <Text
                className="text-[11.5px] text-[#7A9BB8] ml-1"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                ({job.client.reviews} reviews)
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-[#E6F7FF] px-2.5 py-1 rounded-full border border-[#B8E2F8]">
          <Text
            className="text-[11px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Verified Client
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text
        className="text-[14px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Issue Description
      </Text>
      <Text
        className="text-[13px] text-[#5B7C99] mb-4"
        style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
      >
        {job.description}
      </Text>

      {/* Requirements */}
      <Text
        className="text-[14px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Client Requirements
      </Text>
      <View className="mb-6">
        {job.requirements.map((req, idx) => (
          <View key={idx} className="flex-row items-start mb-2">
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#00A8E8"
              style={{ marginTop: 2, marginRight: 8 }}
            />
            <Text
              className="text-[12.5px] text-[#334E68] flex-1"
              style={{ fontFamily: "Poppins-Regular", lineHeight: 18 }}
            >
              {req}
            </Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onRequestCustomQuote(job)}
          className="flex-1 bg-[#F0F7FC] py-3.5 rounded-full items-center border border-[#DCEFFB] mr-2"
        >
          <Text
            className="text-[13.5px] text-[#003B73]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Custom Quote
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onAcceptJob(job)}
          className={`flex-1 py-3.5 rounded-full items-center ${
            isApplied ? "bg-[#10B981]" : "bg-[#00A8E8]"
          }`}
        >
          <Text
            className="text-[13.5px] text-white"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {isApplied ? "Applied ✓" : "Accept Job"}
          </Text>
        </TouchableOpacity>
      </View>
    </BaseBottomSheet>
  );
}

