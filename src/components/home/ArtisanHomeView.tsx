import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { images } from "../../constants/images";
import { ARTISAN_JOB_REQUESTS, ArtisanJobRequest } from "../../data/artisans";
import {
  AvailableJobsModal,
  CustomQuoteModal,
  JobLeadDetailsModal,
  WithdrawFundsModal,
} from "../modals";

interface ArtisanHomeViewProps {
  artisanName: string;
  onSwitchRole: (nextRole: "customer" | "artisan") => void;
}

type JobFilterTab = "Nearby" | "Most Recent" | "Highest Pay";

const QUICK_ACTIONS = [
  {
    id: "view-jobs",
    label: "View Jobs",
    iconName: "location" as const,
    iconFamily: "Ionicons" as const,
  },
  {
    id: "my-bookings",
    label: "My Bookings",
    iconName: "calendar-check-outline" as const,
    iconFamily: "MaterialCommunityIcons" as const,
  },
  {
    id: "wallet",
    label: "Wallet",
    iconName: "wallet-outline" as const,
    iconFamily: "Ionicons" as const,
  },
  {
    id: "profile",
    label: "Profile",
    iconName: "person-outline" as const,
    iconFamily: "Ionicons" as const,
  },
];

export function ArtisanHomeView({
  artisanName,
  onSwitchRole,
}: ArtisanHomeViewProps) {
  const [showAvailableJobsModal, setShowAvailableJobsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ArtisanJobRequest | null>(null);
  const [quotingJob, setQuotingJob] = useState<ArtisanJobRequest | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<JobFilterTab>("Nearby");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const firstName = artisanName.trim().split(" ")[0] || "Emeka";
  const featuredJob = ARTISAN_JOB_REQUESTS[0];

  const filteredJobs = ARTISAN_JOB_REQUESTS.filter((job) =>
    job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    job.serviceType.toLowerCase().includes(jobSearch.toLowerCase())
  ).sort((a, b) => {
    if (activeFilter === "Highest Pay") {
      return b.budgetNumeric - a.budgetNumeric;
    }
    return 0;
  });

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "view-jobs":
        setShowAvailableJobsModal(true);
        break;
      case "my-bookings":
        router.push("/(tabs)/jobs");
        break;
      case "wallet":
        router.push("/(tabs)/market");
        break;
      case "profile":
        router.push("/(tabs)/account");
        break;
    }
  };

  const handleApplyJob = (job: ArtisanJobRequest) => {
    if (!appliedJobIds.includes(job.id)) {
      setAppliedJobIds((prev) => [...prev, job.id]);
    }
    setSelectedJob(null);
    Toast.show({
      type: "success",
      text1: "Application Sent!",
      text2: `You applied for "${job.title}" (${job.budget}).`,
    });
  };

  return (
    <View className="flex-1">
      {/* Top Role Switcher Bar for Seamless Customer <-> Artisan Testing */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center bg-primary-50 border border-[#B8E2F8] px-3 py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5" />
          <Text
            className="text-[11px] text-[#003B73]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Artisan Dashboard
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSwitchRole("customer")}
          className="flex-row items-center bg-white border border-[#D6ECFA] px-3 py-1 rounded-full"
        >
          <Ionicons name="swap-horizontal" size={13} color="#00A8E8" />
          <Text
            className="text-[11px] text-[#003B73] ml-1"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Switch to Customer
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================
          1. ARTISAN HEADER ("Hello, Emeka 👋" + Bell + Avatar)
          Matches skilled4-Artisan-Home-Screen.png
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-1 pr-3">
          <Text
            className="text-[24px] text-[#003B73]"
            style={{ fontFamily: "Poppins-Bold", lineHeight: 32 }}
            numberOfLines={1}
          >
            Hello, {firstName} 👋
          </Text>
          <Text
            className="text-[14px] text-[#5B7C99] mt-0.5"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Ready to work today?
          </Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              Toast.show({
                type: "info",
                text1: "Notifications",
                text2: "You have 3 new nearby job requests!",
              })
            }
            className="w-10 h-10 rounded-full items-center justify-center mr-2.5 relative"
          >
            <Ionicons name="notifications-outline" size={24} color="#2563EB" />
            <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/account")}
            style={styles.avatarShadow}
            className="w-13 h-13 rounded-full border-2 border-white bg-primary-50 overflow-hidden"
          >
            <Image
              source={images.artisanEmeka}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================
          2. TODAY'S OPPORTUNITIES HERO CARD
          Matches skilled4-Artisan-Home-Screen.png
         ============================================================ */}
      <View
        style={styles.heroCardShadow}
        className="w-full rounded-[22px] bg-[#0099DF] p-5 mb-6 overflow-hidden relative border border-[#47C4FF]"
      >
        {/* Decorative Background Glows & Route Rings matching reference */}
        <View
          style={styles.heroCircleLarge}
          className="absolute rounded-full bg-[#24B8FA]/40"
        />
        <View
          style={styles.heroCircleSmall}
          className="absolute rounded-full bg-[#6BD4FF]/30"
        />
        <View
          style={styles.heroRouteWave}
          className="absolute rounded-full border-2 border-white/35"
        />
        <View
          style={styles.heroRouteWaveInner}
          className="absolute rounded-full border border-white/25"
        />

        {/* Right Side Map Pins Graphic */}
        <View style={styles.heroPinsCluster} pointerEvents="none">
          {/* White Pin with Blue Wrench/Cross Badge */}
          <View className="items-center mr-2 -mt-1">
            <View
              style={styles.pinShadow}
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
            >
              <MaterialCommunityIcons
                name="wrench"
                size={18}
                color="#0099DF"
              />
            </View>
            <View className="w-3 h-3 bg-white rotate-45 -mt-1.5" />
          </View>

          {/* Blue Pin with White Center */}
          <View className="items-center mt-2">
            <View
              style={styles.pinShadow}
              className="w-9 h-9 rounded-full bg-[#0082C8] border-2 border-white/90 items-center justify-center"
            >
              <View className="w-3 h-3 rounded-full bg-white" />
            </View>
            <View className="w-2.5 h-2.5 bg-[#0082C8] rotate-45 -mt-1" />
          </View>
        </View>

        {/* Left Content */}
        <Text
          className="text-[15.5px] text-white mb-1.5"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Today&apos;s Opportunities
        </Text>

        <View className="flex-row items-baseline mb-3.5">
          <Text
            className="text-[36px] text-white mr-2"
            style={{ fontFamily: "Poppins-Bold", lineHeight: 42 }}
          >
            {ARTISAN_JOB_REQUESTS.length - 1}
          </Text>
          <Text
            className="text-[14.5px] text-white/95"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            new nearby requests
          </Text>
        </View>

        {/* Bottom Row: Shift Indicator + "View" Button */}
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center flex-1 mr-4">
            <View className="flex-row items-center bg-white/20 px-2.5 py-1 rounded-full mr-2">
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text
                className="text-[11px] text-white ml-1"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                10a - 6p
              </Text>
            </View>
            <View className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden max-w-22.5">
              <View className="w-2/3 h-full bg-white/80 rounded-full" />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowAvailableJobsModal(true)}
            style={styles.viewBtnShadow}
            className="bg-primary border border-[#8CE0FF] px-6 py-2 rounded-full"
          >
            <Text
              className="text-[13.5px] text-white"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================
          3. QUICK ACTIONS (4 Cards: View Jobs, My Bookings, Wallet, Profile)
          Matches skilled4-Artisan-Home-Screen.png
         ============================================================ */}
      <Text
        className="text-[17px] text-[#003B73] mb-3"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        Quick Actions
      </Text>

      <View className="flex-row justify-between mb-6">
        {QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => handleQuickAction(item.id)}
            style={[styles.quickActionCard, styles.cardShadow]}
            className="bg-white rounded-2xl py-3.5 px-1.5 items-center justify-center border border-[#DCEFFB]"
          >
            <View className="w-11 h-11 rounded-full bg-primary-50 items-center justify-center mb-2">
              {item.iconFamily === "MaterialCommunityIcons" ? (
                <MaterialCommunityIcons
                  name={item.iconName as any}
                  size={22}
                  color="#0099DF"
                />
              ) : (
                <Ionicons
                  name={item.iconName as any}
                  size={21}
                  color="#0099DF"
                />
              )}
            </View>
            <Text
              className="text-[11.5px] text-[#003B73] text-center"
              style={{ fontFamily: "Poppins-Medium" }}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ============================================================
          4. FEATURED JOB CARD ("Fix leaking kitchen sink")
          Matches skilled4-Artisan-Home-Screen.png
         ============================================================ */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-[17px] text-[#003B73]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Featured Job
        </Text>
        <TouchableOpacity onPress={() => setShowAvailableJobsModal(true)}>
          <Text
            className="text-[13px] text-[#00A8E8]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            See All ({ARTISAN_JOB_REQUESTS.length})
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelectedJob(featuredJob)}
        style={styles.cardShadow}
        className="bg-white rounded-[22px] border border-[#DCEFFB] p-2.5 mb-4"
      >
        <View className="w-full h-36 rounded-2xl overflow-hidden mb-3 bg-primary-50">
          <Image
            source={featuredJob.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="px-2 pb-1.5">
          <Text
            className="text-[17px] text-[#003B73] mb-1.5"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {featuredJob.title}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text
                className="text-[14.5px] text-[#003B73]"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {featuredJob.distance}
              </Text>
              <Text className="text-[14px] text-[#7A9BB8] mx-1.5">•</Text>
              <Text
                className="text-[15px] text-[#003B73]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {featuredJob.budget}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedJob(featuredJob)}
              style={styles.applyBtnShadow}
              className={`px-7 py-2.5 rounded-full ${
                appliedJobIds.includes(featuredJob.id)
                  ? "bg-green-500"
                  : "bg-primary"
              }`}
            >
              <Text
                className="text-[14px] text-white"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {appliedJobIds.includes(featuredJob.id) ? "Applied ✓" : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* ============================================================
          ARTISAN INTERACTION MODALS
          1. Available Jobs / Nearby Requests Sheet
         ============================================================ */}
      <AvailableJobsModal
        visible={showAvailableJobsModal}
        onClose={() => setShowAvailableJobsModal(false)}
        onSelectJob={(job) => {
          setShowAvailableJobsModal(false);
          setSelectedJob(job);
        }}
        appliedJobIds={appliedJobIds}
      />

      {/* 2. Job Lead Details Modal */}
      <JobLeadDetailsModal
        visible={!!selectedJob}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        isApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
        onAcceptJob={(job) => handleApplyJob(job)}
        onRequestCustomQuote={(job) => {
          setSelectedJob(null);
          setQuotingJob(job);
        }}
      />

      {/* 3. Custom Quote Counter-Offer Modal */}
      <CustomQuoteModal
        visible={!!quotingJob}
        job={quotingJob}
        onClose={() => setQuotingJob(null)}
        onSubmitQuote={(quote) => {
          Toast.show({
            type: "success",
            text1: "Quote Submitted! 💼",
            text2: `Sent ₦${(quote.laborFee + quote.materialsFee).toLocaleString()} quote to client.`,
          });
          if (quotingJob && !appliedJobIds.includes(quotingJob.id)) {
            setAppliedJobIds((prev) => [...prev, quotingJob.id]);
          }
          setQuotingJob(null);
        }}
      />

      {/* 4. Wallet Earnings Withdrawal Modal */}
      <WithdrawFundsModal
        visible={showWithdrawModal}
        availableBalance={148500}
        onClose={() => setShowWithdrawModal(false)}
        onSuccessWithdrawal={() => {
          setShowWithdrawModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  heroCardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroCircleLarge: {
    width: 170,
    height: 170,
    top: -45,
    right: -35,
  },
  heroCircleSmall: {
    width: 90,
    height: 90,
    bottom: -25,
    right: 65,
  },
  heroRouteWave: {
    width: 150,
    height: 110,
    right: -25,
    bottom: -30,
    transform: [{ rotate: "-18deg" }],
  },
  heroRouteWaveInner: {
    width: 120,
    height: 85,
    right: -15,
    bottom: -20,
    transform: [{ rotate: "-18deg" }],
  },
  heroPinsCluster: {
    position: "absolute",
    top: 16,
    right: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pinShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#003B73",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  viewBtnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#002B54",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  applyBtnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickActionCard: {
    width: "23.5%",
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 31, 63, 0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    maxHeight: "88%",
  },
});

