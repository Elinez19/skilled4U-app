import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

interface WithdrawFundsModalProps {
  visible: boolean;
  availableBalance?: number;
  onClose: () => void;
  onSuccessWithdrawal?: (amount: number) => void;
}

const PERCENTAGES = [0.25, 0.5, 0.75, 1.0];

export function WithdrawFundsModal({
  visible,
  availableBalance = 148500,
  onClose,
  onSuccessWithdrawal,
}: WithdrawFundsModalProps) {
  const [amountStr, setAmountStr] = useState("50000");
  const [selectedBank, setSelectedBank] = useState("gtb");

  const amountNum = parseInt(amountStr, 10) || 0;
  const transferFee = 50;
  const netPayout = Math.max(0, amountNum - transferFee);

  const handleSetPercent = (pct: number) => {
    const val = Math.floor(availableBalance * pct);
    setAmountStr(val.toString());
  };

  const handleWithdraw = () => {
    if (amountNum < 1000) {
      Toast.show({
        type: "error",
        text1: "Minimum Withdrawal",
        text2: "The minimum withdrawal amount is ₦1,000.",
      });
      return;
    }

    if (amountNum > availableBalance) {
      Toast.show({
        type: "error",
        text1: "Insufficient Balance",
        text2: "You cannot withdraw more than your available balance.",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Withdrawal Initiated! 💳",
      text2: `₦${netPayout.toLocaleString()} is being sent to your bank account.`,
    });

    if (onSuccessWithdrawal) {
      onSuccessWithdrawal(amountNum);
    }
    onClose();
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Withdraw Funds"
      subtitle="Transfer earnings to your bank account"
      scrollable
      maxHeight="88%"
    >
      {/* Available Balance Box */}
      <View className="bg-[#E6F7FF] border border-[#B8E2F8] p-4 rounded-2xl mb-4 flex-row items-center justify-between">
        <View>
          <Text
            className="text-[12px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            AVAILABLE BALANCE
          </Text>
          <Text
            className="text-[22px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            ₦{availableBalance.toLocaleString()}
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#00A8E8]/15 items-center justify-center">
          <Ionicons name="wallet-outline" size={20} color="#00A8E8" />
        </View>
      </View>

      {/* Amount Input */}
      <Text
        className="text-[13px] text-[#003B73] mb-1.5"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Withdrawal Amount (₦)
      </Text>
      <View className="flex-row items-center bg-[#F8FCFF] border border-[#D6ECFA] rounded-2xl px-3.5 py-2.5 mb-2.5">
        <Text
          className="text-[16px] text-[#00A8E8] mr-2"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          ₦
        </Text>
        <TextInput
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#8AA8C4"
          className="flex-1 text-[16px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        />
      </View>

      {/* Percentage Shortcut Buttons */}
      <View className="flex-row mb-4">
        {PERCENTAGES.map((pct) => (
          <TouchableOpacity
            key={pct}
            activeOpacity={0.8}
            onPress={() => handleSetPercent(pct)}
            className="flex-1 py-1.5 rounded-xl bg-[#F0F7FC] border border-[#DCEFFB] items-center mr-2"
          >
            <Text
              className="text-[11.5px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              {pct === 1.0 ? "MAX" : `${pct * 100}%`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Destination Bank Account */}
      <Text
        className="text-[13px] text-[#003B73] mb-2"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Destination Bank
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedBank("gtb")}
        className={`flex-row items-center justify-between p-3.5 rounded-2xl mb-2.5 border ${
          selectedBank === "gtb"
            ? "bg-[#EBF7FF] border-[#00A8E8]"
            : "bg-white border-[#E2EEF8]"
        }`}
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-9 h-9 rounded-xl bg-[#E6F7FF] items-center justify-center mr-3">
            <Ionicons name="business-outline" size={18} color="#00A8E8" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13.5px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Guaranty Trust Bank (GTB)
            </Text>
            <Text
              className="text-[11.5px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              0123456789 • Emeka Okafor
            </Text>
          </View>
        </View>
        <Ionicons
          name={selectedBank === "gtb" ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color="#00A8E8"
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedBank("kuda")}
        className={`flex-row items-center justify-between p-3.5 rounded-2xl mb-4 border ${
          selectedBank === "kuda"
            ? "bg-[#EBF7FF] border-[#00A8E8]"
            : "bg-white border-[#E2EEF8]"
        }`}
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-9 h-9 rounded-xl bg-[#F0F7FC] items-center justify-center mr-3">
            <Ionicons name="card-outline" size={18} color="#003B73" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[13.5px] text-[#003B73]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Kuda Microfinance Bank
            </Text>
            <Text
              className="text-[11.5px] text-[#5B7C99]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              2019883441 • Emeka Okafor
            </Text>
          </View>
        </View>
        <Ionicons
          name={
            selectedBank === "kuda" ? "checkmark-circle" : "ellipse-outline"
          }
          size={20}
          color="#00A8E8"
        />
      </TouchableOpacity>

      {/* Payout Summary */}
      <View className="bg-[#FAFDFE] border border-[#E6F3FC] rounded-2xl p-3 mb-5">
        <View className="flex-row justify-between mb-1">
          <Text
            className="text-[12px] text-[#5B7C99]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Processing Fee
          </Text>
          <Text
            className="text-[12px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            ₦{transferFee}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text
            className="text-[13px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Net Bank Payout
          </Text>
          <Text
            className="text-[14px] text-[#10B981]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            ₦{netPayout.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Withdraw Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleWithdraw}
        className="w-full bg-[#00A8E8] py-3.5 rounded-full items-center shadow-sm"
      >
        <Text
          className="text-[14.5px] text-white"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Confirm Withdrawal
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  );
}

