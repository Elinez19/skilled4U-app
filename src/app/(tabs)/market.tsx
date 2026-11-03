import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { images } from "../../constants/images";

type ArtisanSubView = "wallet" | "earnings";
type EarningsPeriod = "This Month" | "Last 3 Months" | "All Time";

const CUSTOMER_WALLET_ACTIONS = [
  { id: "send", label: "Send", icon: "paper-plane-outline" as const },
  { id: "receive", label: "Receive", icon: "download-outline" as const },
  { id: "transaction", label: "Transaction", icon: "receipt-outline" as const },
  { id: "cards", label: "Cards", icon: "card-outline" as const },
];

const CUSTOMER_TRANSACTIONS = [
  {
    id: "ct-1",
    title: "Service Payment",
    subtitle: "Emeka Okafor (Plumber)",
    dateTime: "14 May 2025 • 11:35 AM",
    amount: "- ₦15,000",
    isCredit: false,
    icon: "person-outline" as const,
  },
  {
    id: "ct-2",
    title: "Wallet Top Up",
    subtitle: "Card Payment",
    dateTime: "12 May 2025 • 4:20 PM",
    amount: "+ ₦10,000",
    isCredit: true,
    icon: "card-outline" as const,
  },
  {
    id: "ct-3",
    title: "Service Payment",
    subtitle: "Aisha Yusuf (Electrician)",
    dateTime: "10 May 2025 • 2:15 PM",
    amount: "- ₦12,000",
    isCredit: false,
    icon: "construct-outline" as const,
  },
  {
    id: "ct-4",
    title: "Wallet Top Up",
    subtitle: "Bank Transfer",
    dateTime: "8 May 2025 • 9:10 AM",
    amount: "+ ₦5,000",
    isCredit: true,
    icon: "wallet-outline" as const,
  },
];

const ARTISAN_TRANSACTIONS = [
  {
    id: "at-1",
    title: "Job Payment",
    dateTime: "May 14, 2025 • 10:00 AM",
    amount: "+₦15,000",
    type: "credit" as const,
    icon: "construct-outline" as const,
  },
  {
    id: "at-2",
    title: "Job Payment",
    dateTime: "May 12, 2025 • 3:20 PM",
    amount: "+₦12,000",
    type: "credit" as const,
    icon: "hammer-outline" as const,
  },
  {
    id: "at-3",
    title: "Withdrawal",
    dateTime: "May 10, 2025 • 9:00 AM",
    amount: "-₦20,000",
    type: "debit" as const,
    icon: "wallet-outline" as const,
  },
  {
    id: "at-4",
    title: "Job Payment",
    dateTime: "May 8, 2025 • 2:15 PM",
    amount: "+₦18,000",
    type: "credit" as const,
    icon: "cash-outline" as const,
  },
];

const CHART_BARS = [
  { id: 1, heightPct: 22 },
  { id: 2, heightPct: 50 },
  { id: 3, heightPct: 64 },
  { id: 4, heightPct: 50 },
  { id: 5, heightPct: 35 },
  { id: 6, heightPct: 26 },
  { id: 7, heightPct: 76 },
  { id: 8, heightPct: 98 },
];

export default function WalletAndEarningsScreen() {
  const [role, setRole] = useState<"customer" | "artisan">("customer");
  const [artisanView, setArtisanView] = useState<ArtisanSubView>("wallet");
  const [earningsPeriod, setEarningsPeriod] =
    useState<EarningsPeriod>("This Month");
  const [customerBalance, setCustomerBalance] = useState(25000);
  const [artisanBalance, setArtisanBalance] = useState(165000);

  useFocusEffect(
    useCallback(() => {
      const loadRole = async () => {
        try {
          const raw = await AsyncStorage.getItem("skilled4u_user_draft");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.role === "artisan" || parsed.role === "customer") {
              setRole(parsed.role);
            }
          }
        } catch {
          // ignore
        }
      };
      loadRole();
    }, [])
  );

  const handleTopUpCustomer = () => {
    setCustomerBalance((prev) => prev + 5000);
    Toast.show({
      type: "success",
      text1: "Wallet Topped Up!",
      text2: "₦5,000 has been added to your Skilled4U wallet.",
    });
  };

  const handleWithdrawArtisan = () => {
    if (artisanBalance >= 20000) {
      setArtisanBalance((prev) => prev - 20000);
      Toast.show({
        type: "success",
        text1: "Withdrawal Initiated",
        text2: "₦20,000 is on its way to your linked bank account.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      {/* Top Navigation & Role/View Switcher */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="w-10 h-10 rounded-full bg-white border border-[#D6ECFA] items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#003B73" />
          </TouchableOpacity>
          <Text
            className="text-[20px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {role === "customer"
              ? "Wallet & Payments"
              : artisanView === "wallet"
                ? "Wallet"
                : "Earnings"}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setRole((prev) => (prev === "customer" ? "artisan" : "customer"))
          }
          className="flex-row items-center bg-white border border-[#D6ECFA] px-3 py-1.5 rounded-full"
        >
          <Ionicons name="swap-horizontal" size={13} color="#00A8E8" />
          <Text
            className="text-[11px] text-[#003B73] ml-1"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            {role === "artisan" ? "Artisan" : "Customer"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Artisan Sub-Switcher: Wallet (Screen 6) <-> Earnings (Screen 5) */}
      {role === "artisan" && (
        <View className="flex-row bg-[#E3F3FC] mx-5 p-1 rounded-full mb-4 border border-[#CDE8F8]">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setArtisanView("wallet")}
            className={`flex-1 py-2 rounded-full items-center ${
              artisanView === "wallet" ? "bg-[#00A8E8]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[12.5px] ${
                artisanView === "wallet" ? "text-white" : "text-[#003B73]"
              }`}
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Wallet & Withdraw
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setArtisanView("earnings")}
            className={`flex-1 py-2 rounded-full items-center ${
              artisanView === "earnings" ? "bg-[#00A8E8]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[12.5px] ${
                artisanView === "earnings" ? "text-white" : "text-[#003B73]"
              }`}
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Earnings Analytics
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {role === "customer" ? (
          /* ============================================================
             CUSTOMER WALLET & PAYMENTS
             Matches skilled4-customer-Wallet-Payments-screen-2.png
             ============================================================ */
          <>
            {/* Wallet Balance Card */}
            <View
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-5 mb-4 border border-[#DCEFFB] flex-row items-center justify-between"
            >
              <View>
                <Text
                  className="text-[12.5px] text-[#5B7C99] mb-1"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Wallet Balance
                </Text>
                <Text
                  className="text-[28px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 34 }}
                >
                  ₦{customerBalance.toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleTopUpCustomer}
                style={styles.primaryBtnShadow}
                className="bg-[#00A8E8] px-4 py-2.5 rounded-xl"
              >
                <Text
                  className="text-[13px] text-white"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Add Money
                </Text>
              </TouchableOpacity>
            </View>

            {/* 4 Quick Actions: Send | Receive | Transaction | Cards */}
            <View className="flex-row justify-between mb-6">
              {CUSTOMER_WALLET_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  activeOpacity={0.8}
                  onPress={() =>
                    Toast.show({
                      type: "info",
                      text1: action.label,
                      text2: `${action.label} feature ready.`,
                    })
                  }
                  style={[styles.actionCard, styles.cardShadow]}
                  className="bg-white rounded-2xl py-3.5 px-1.5 items-center justify-center border border-[#DCEFFB]"
                >
                  <View className="w-10 h-10 rounded-xl bg-[#E6F7FF] items-center justify-center mb-2">
                    <Ionicons
                      name={action.icon}
                      size={20}
                      color="#0099DF"
                    />
                  </View>
                  <Text
                    className="text-[11.5px] text-[#003B73] text-center"
                    style={{ fontFamily: "Poppins-Medium" }}
                    numberOfLines={1}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent Transactions */}
            <Text
              className="text-[16px] text-[#003B73] mb-3"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Recent Transactions
            </Text>

            {CUSTOMER_TRANSACTIONS.map((tx) => (
              <View
                key={tx.id}
                style={styles.cardShadow}
                className="bg-white rounded-2xl p-4 mb-3 border border-[#DCEFFB] flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View className="w-11 h-11 rounded-full bg-[#E1F4FF] items-center justify-center mr-3">
                    <Ionicons name={tx.icon} size={20} color="#0099DF" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-[14px] text-[#003B73]"
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {tx.title}
                    </Text>
                    <Text
                      className="text-[12px] text-[#5B7C99] my-0.5"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {tx.subtitle}
                    </Text>
                    <Text
                      className="text-[11px] text-[#8AA8C4]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {tx.dateTime}
                    </Text>
                  </View>
                </View>

                <Text
                  className={`text-[14.5px] ${
                    tx.isCredit ? "text-[#10B981]" : "text-[#003B73]"
                  }`}
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  {tx.amount}
                </Text>
              </View>
            ))}
          </>
        ) : artisanView === "wallet" ? (
          /* ============================================================
             ARTISAN WALLET & WITHDRAW (Screen 6)
             Matches skilled4-Artisan-Wallets-Withdraw-Screen.png
             ============================================================ */
          <>
            <View
              style={styles.cardShadow}
              className="bg-white rounded-3xl p-5 mb-6 border border-[#DCEFFB]"
            >
              <Text
                className="text-[32px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold", lineHeight: 40 }}
              >
                ₦{artisanBalance.toLocaleString()}
              </Text>
              <Text
                className="text-[13.5px] text-[#5B7C99] mb-4"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Available Balance
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleWithdrawArtisan}
                style={styles.primaryBtnShadow}
                className="w-full bg-[#00A8E8] py-3.5 rounded-full items-center"
              >
                <Text
                  className="text-[15px] text-white"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Withdraw Funds
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              className="text-[16px] text-[#003B73] mb-3"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Recent Transactions
            </Text>

            {ARTISAN_TRANSACTIONS.map((tx) => {
              const isDebit = tx.type === "debit";
              return (
                <View
                  key={tx.id}
                  style={styles.cardShadow}
                  className="bg-white rounded-2xl p-4 mb-3 border border-[#DCEFFB] flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View
                      className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${
                        isDebit ? "bg-[#FEE2E2]" : "bg-[#E1F4FF]"
                      }`}
                    >
                      <Ionicons
                        name={tx.icon}
                        size={20}
                        color={isDebit ? "#EF4444" : "#0099DF"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[14.5px] text-[#003B73]"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        {tx.title}
                      </Text>
                      <Text
                        className="text-[12px] text-[#5B7C99] mt-0.5"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        {tx.dateTime}
                      </Text>
                    </View>
                  </View>

                  <Text
                    className={`text-[14.5px] ${
                      isDebit ? "text-[#EF4444]" : "text-[#10B981]"
                    }`}
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    {tx.amount}
                  </Text>
                </View>
              );
            })}
          </>
        ) : (
          /* ============================================================
             ARTISAN EARNINGS ANALYTICS (Screen 5)
             Matches skilled4-Artisan-Earnings-Screen.png
             ============================================================ */
          <>
            {/* Total Earnings Blue Hero Card */}
            <View
              style={styles.primaryBtnShadow}
              className="bg-[#0099DF] rounded-3xl p-5 mb-4 flex-row items-center justify-between border border-[#47C4FF]"
            >
              <View>
                <Text
                  className="text-[14px] text-white/90 mb-1"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Total Earnings
                </Text>
                <Text
                  className="text-[30px] text-white mb-0.5"
                  style={{ fontFamily: "Poppins-Bold", lineHeight: 36 }}
                >
                  ₦{artisanBalance.toLocaleString()}
                </Text>
                <Text
                  className="text-[12.5px] text-white/85"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {earningsPeriod}
                </Text>
              </View>

              <View className="w-15 h-15 rounded-full bg-white/20 border border-white/30 items-center justify-center">
                <MaterialCommunityIcons
                  name="chart-bar"
                  size={28}
                  color="#FFFFFF"
                />
              </View>
            </View>

            {/* Period Filter Pills: This Month | Last 3 Months | All Time */}
            <View className="flex-row justify-between mb-4">
              {(
                ["This Month", "Last 3 Months", "All Time"] as EarningsPeriod[]
              ).map((period) => {
                const isSelected = earningsPeriod === period;
                return (
                  <TouchableOpacity
                    key={period}
                    activeOpacity={0.8}
                    onPress={() => setEarningsPeriod(period)}
                    style={{ width: "31.5%" }}
                    className={`py-2 rounded-full items-center justify-center border ${
                      isSelected
                        ? "bg-[#00A8E8] border-[#00A8E8]"
                        : "bg-[#E9F5FD] border-[#D0E8F8]"
                    }`}
                  >
                    <Text
                      className={`text-[11.5px] ${
                        isSelected ? "text-white" : "text-[#5B7C99]"
                      }`}
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2 Side-by-Side Stat Cards */}
            <View className="flex-row justify-between mb-3.5">
              <View
                style={[styles.halfStatCard, styles.cardShadow]}
                className="bg-white rounded-2xl p-4 border border-[#DCEFFB]"
              >
                <Text
                  className="text-[12.5px] text-[#5B7C99] mb-1.5"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Completed Jobs
                </Text>
                <Text
                  className="text-[24px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  12
                </Text>
              </View>

              <View
                style={[styles.halfStatCard, styles.cardShadow]}
                className="bg-white rounded-2xl p-4 border border-[#DCEFFB]"
              >
                <Text
                  className="text-[12.5px] text-[#5B7C99] mb-1.5"
                  style={{ fontFamily: "Poppins-Medium" }}
                >
                  Pending Payments
                </Text>
                <Text
                  className="text-[24px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  2
                </Text>
              </View>
            </View>

            {/* Average per Job Card */}
            <View
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-4 mb-5 border border-[#DCEFFB]"
            >
              <Text
                className="text-[12.5px] text-[#5B7C99] mb-1"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                Average per Job
              </Text>
              <Text
                className="text-[22px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                ₦13,750
              </Text>
            </View>

            {/* Bar Chart Card matching skilled4-Artisan-Earnings-Screen.png */}
            <View
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-4 border border-[#DCEFFB]"
            >
              <View className="flex-row h-36">
                {/* Y-Axis Labels */}
                <View className="justify-between pr-2.5 pb-5">
                  <Text
                    className="text-[10.5px] text-[#7A9BB8]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    200
                  </Text>
                  <Text
                    className="text-[10.5px] text-[#7A9BB8]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    100
                  </Text>
                  <Text
                    className="text-[10.5px] text-[#7A9BB8]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    0
                  </Text>
                </View>

                {/* Bars Area */}
                <View className="flex-1 justify-end">
                  <View className="flex-row items-end justify-between h-28 border-b border-[#E2F1FC] px-1">
                    {CHART_BARS.map((bar) => (
                      <View
                        key={bar.id}
                        style={{ height: `${bar.heightPct}%` }}
                        className="w-5 rounded-t-md bg-[#00A8E8]"
                      />
                    ))}
                  </View>

                  {/* X-Axis Labels */}
                  <View className="flex-row justify-between pt-2">
                    {["May 1", "May 8", "May 15", "May 22", "May 31"].map(
                      (lbl) => (
                        <Text
                          key={lbl}
                          className="text-[10.5px] text-[#5B7C99]"
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          {lbl}
                        </Text>
                      )
                    )}
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FAFF",
  },
  bgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.65,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  actionCard: {
    width: "23.5%",
  },
  halfStatCard: {
    width: "48.2%",
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  primaryBtnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
