import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

export type ArtisanJobProgressStatus =
  | "Pending"
  | "Confirmed"
  | "On the Way"
  | "Arrived"
  | "In Progress"
  | "Completed";

interface JobStatusActionModalProps {
  visible: boolean;
  jobTitle?: string;
  clientName?: string;
  currentStatus: ArtisanJobProgressStatus;
  onClose: () => void;
  onUpdateStatus: (newStatus: ArtisanJobProgressStatus) => void;
  onRequestCompletionCode: () => void;
  onCallClient?: () => void;
  onChatClient?: () => void;
}

export function JobStatusActionModal({
  visible,
  jobTitle = "Plumbing Service",
  clientName = "Aisha Bello",
  currentStatus,
  onClose,
  onUpdateStatus,
  onRequestCompletionCode,
  onCallClient,
  onChatClient,
}: JobStatusActionModalProps) {
  const handleAction = (status: ArtisanJobProgressStatus) => {
    if (status === "Completed") {
      onRequestCompletionCode();
    } else {
      onUpdateStatus(status);
    }
    onClose();
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Update Job Progress"
      subtitle={`${jobTitle} for ${clientName}`}
      scrollable
      maxHeight="82%"
    >
      {/* Current Status Pill */}
      <View className="flex-row items-center justify-between bg-[#F4FAFF] border border-[#DCEFFB] p-3 rounded-2xl mb-4">
        <Text
          className="text-[13px] text-[#5B7C99]"
          style={{ fontFamily: "Poppins-Medium" }}
        >
          Current Status:
        </Text>
        <View className="bg-[#E6F7FF] border border-[#B8E2F8] px-3 py-1 rounded-full">
          <Text
            className="text-[12px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {currentStatus}
          </Text>
        </View>
      </View>

      {/* Action Options */}
      <View className="space-y-2.5 mb-5">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("On the Way")}
          className="flex-row items-center p-3.5 rounded-2xl bg-white border border-[#DCEFFB] mb-2"
        >
          <View className="w-9 h-9 rounded-xl bg-[#E6F7FF] items-center justify-center mr-3">
            <Ionicons name="navigate-outline" size={20} color="#00A8E8" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13.5px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Start Journey to Client
            </Text>
            <Text
              className="text-[11.5px] text-[#7A9BB8]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Notifies client that you're in transit
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0B8CD" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("Arrived")}
          className="flex-row items-center p-3.5 rounded-2xl bg-white border border-[#DCEFFB] mb-2"
        >
          <View className="w-9 h-9 rounded-xl bg-[#E8F8F0] items-center justify-center mr-3">
            <Ionicons name="location-outline" size={20} color="#10B981" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13.5px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              I Have Arrived
            </Text>
            <Text
              className="text-[11.5px] text-[#7A9BB8]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Client will receive arrival notification & prompt PIN
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0B8CD" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("In Progress")}
          className="flex-row items-center p-3.5 rounded-2xl bg-white border border-[#DCEFFB] mb-2"
        >
          <View className="w-9 h-9 rounded-xl bg-[#FFF7ED] items-center justify-center mr-3">
            <Ionicons name="hammer-outline" size={20} color="#F97316" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13.5px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Start Service Work
            </Text>
            <Text
              className="text-[11.5px] text-[#7A9BB8]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Work has commenced at the location
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0B8CD" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("Completed")}
          className="flex-row items-center p-3.5 rounded-2xl bg-[#E8F8F0] border border-[#B2F0D2]"
        >
          <View className="w-9 h-9 rounded-xl bg-[#10B981] items-center justify-center mr-3">
            <Ionicons name="checkmark-done" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13.5px] text-[#059669]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Mark Job as Completed
            </Text>
            <Text
              className="text-[11.5px] text-[#10B981]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Requires client 4-digit completion code
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Contact Client Row */}
      <View className="flex-row items-center space-x-2 pt-2 border-t border-[#F0F6FA]">
        {onCallClient && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCallClient}
            className="flex-1 flex-row items-center justify-center bg-[#F0F7FC] py-3 rounded-full border border-[#DCEFFB] mr-2"
          >
            <Ionicons name="call-outline" size={16} color="#00A8E8" />
            <Text
              className="text-[13px] text-[#003B73] ml-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Call Client
            </Text>
          </TouchableOpacity>
        )}

        {onChatClient && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onChatClient}
            className="flex-1 flex-row items-center justify-center bg-[#E6F7FF] py-3 rounded-full border border-[#B8E2F8]"
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={16}
              color="#00A8E8"
            />
            <Text
              className="text-[13px] text-[#00A8E8] ml-1.5"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Chat Client
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </BaseBottomSheet>
  );
}

