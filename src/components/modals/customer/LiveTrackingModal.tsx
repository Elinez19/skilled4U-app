import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

export interface TrackingData {
  id: string;
  artisanName: string;
  artisanTrade: string;
  service: string;
  avatar: ImageSourcePropType;
  status: "Confirmed" | "On the Way" | "Arrived" | "In Progress" | "Completed";
  etaMinutes?: number;
  securityCode?: string;
  address: string;
  price: string;
}

interface LiveTrackingModalProps {
  visible: boolean;
  data: TrackingData | null;
  onClose: () => void;
  onCallArtisan?: (name: string) => void;
  onChatArtisan?: (name: string) => void;
  onRequestCancel?: (bookingId: string) => void;
}

export function LiveTrackingModal({
  visible,
  data,
  onClose,
  onCallArtisan,
  onChatArtisan,
  onRequestCancel,
}: LiveTrackingModalProps) {
  if (!data) return null;

  const steps = [
    { label: "Booked", done: true },
    {
      label: "On Way",
      done: data.status === "On the Way" || data.status === "Arrived" || data.status === "In Progress",
      current: data.status === "On the Way",
    },
    {
      label: "Arrived",
      done: data.status === "Arrived" || data.status === "In Progress",
      current: data.status === "Arrived",
    },
    {
      label: "Working",
      done: data.status === "In Progress",
      current: data.status === "In Progress",
    },
  ];

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Live Tracking"
      subtitle={`Tracking ${data.artisanName}`}
      scrollable
      maxHeight="86%"
    >
      {/* ETA Banner */}
      <View className="bg-primary-50 border border-[#B8E2F8] p-4 rounded-2xl mb-4 items-center">
        <Text
          className="text-[12px] text-[#00A8E8]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          ESTIMATED ARRIVAL
        </Text>
        <Text
          className="text-[26px] text-[#003B73] my-0.5"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          {data.etaMinutes || 8} mins
        </Text>
        <Text
          className="text-[12.5px] text-[#5B7C99]"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          Artisan is en route to {data.address}
        </Text>
      </View>

      {/* Progress Stepper */}
      <View className="flex-row items-center justify-between mb-5 px-2">
        {steps.map((st, idx) => (
          <React.Fragment key={idx}>
            <View className="items-center">
              <View
                className={`w-7 h-7 rounded-full items-center justify-center border ${
                  st.done
                    ? "bg-primary border-primary"
                    : "bg-white border-[#CBD5E1]"
                }`}
              >
                {st.done ? (
                  <Ionicons name="checkmark" size={15} color="white" />
                ) : (
                  <View className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
                )}
              </View>
              <Text
                className={`text-[11px] mt-1 ${
                  st.current
                    ? "text-[#00A8E8] font-bold"
                    : st.done
                    ? "text-[#003B73]"
                    : "text-[#94A3B8]"
                }`}
                style={{ fontFamily: "Poppins-Medium" }}
              >
                {st.label}
              </Text>
            </View>
            {idx < steps.length - 1 && (
              <View
                className={`flex-1 h-0.5 mx-1 -mt-4 ${
                  steps[idx + 1].done ? "bg-primary" : "bg-[#E2E8F0]"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Security Handshake PIN */}
      <View className="bg-[#FAFDFE] border border-[#DCEFFB] p-3.5 rounded-2xl mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center mr-3">
            <Ionicons name="key-outline" size={18} color="#00A8E8" />
          </View>
          <View>
            <Text
              className="text-[13px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Arrival Verification Code
            </Text>
            <Text
              className="text-[11.5px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Share with artisan only after they arrive
            </Text>
          </View>
        </View>

        <View className="bg-primary-900 px-3.5 py-1.5 rounded-xl">
          <Text
            className="text-[16px] text-white tracking-widest"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {data.securityCode || "5842"}
          </Text>
        </View>
      </View>

      {/* Artisan Profile Card & Quick Actions */}
      <View className="bg-white border border-[#DCEFFB] p-3.5 rounded-2xl mb-5 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          <Image
            source={data.avatar}
            className="w-12 h-12 rounded-full bg-primary-50"
            resizeMode="cover"
          />
          <View className="ml-3 flex-1">
            <Text
              className="text-[14px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
              numberOfLines={1}
            >
              {data.artisanName}
            </Text>
            <Text
              className="text-[12px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {data.artisanTrade || data.service}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onCallArtisan && onCallArtisan(data.artisanName)}
            className="w-10 h-10 rounded-full bg-primary-50 border border-[#B8E2F8] items-center justify-center mr-2"
          >
            <Ionicons name="call" size={18} color="#00A8E8" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChatArtisan && onChatArtisan(data.artisanName)}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          >
            <Ionicons name="chatbubble" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cancel Booking Trigger */}
      {onRequestCancel && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onRequestCancel(data.id)}
          className="items-center py-2"
        >
          <Text
            className="text-[12.5px] text-[#EF4444]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Cancel this booking
          </Text>
        </TouchableOpacity>
      )}
    </BaseBottomSheet>
  );
}

