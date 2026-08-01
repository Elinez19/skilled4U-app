import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Tab = "completed" | "cancelled";

const DUMMY_COMPLETED_JOBS = [
  {
    id: "1",
    service: "Plumbing Repair",
    provider: "John Doe",
    date: "Aug 15, 2026",
    price: "$120",
    status: "Completed",
  },
  {
    id: "2",
    service: "House Cleaning",
    provider: "Jane Smith",
    date: "Aug 10, 2026",
    price: "$80",
    status: "Completed",
  },
];

const DUMMY_CANCELLED_JOBS = [
  {
    id: "3",
    service: "Electrical Fix",
    provider: "Mike Johnson",
    date: "Aug 18, 2026",
    price: "$95",
    status: "Cancelled",
  },
];

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("completed");

  const renderJobCard = (job: any) => (
    <View key={job.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-[#1a365d]">{job.service}</Text>
        <Text className="text-base font-bold text-[#1a365d]">{job.price}</Text>
      </View>
      <Text className="text-gray-500 mb-4 font-medium">Provider: {job.provider}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 font-medium">{job.date}</Text>
        <View className={`px-4 py-1.5 rounded-full ${job.status === "Completed" ? "bg-green-100" : "bg-red-100"}`}>
          <Text className={`text-xs font-bold ${job.status === "Completed" ? "text-green-700" : "text-red-700"}`}>
            {job.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View className="px-5 pt-4">
        <Text className="text-2xl font-bold text-[#1a365d] mb-6">My Jobs</Text>

        {/* Tab Switcher */}
        <View className="flex-row rounded-2xl border border-gray-200 bg-white p-1.5 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab("completed")}
            className={`flex-1 py-3.5 rounded-xl items-center justify-center ${activeTab === "completed" ? "bg-green-100" : "bg-transparent"}`}
          >
            <Text className={`font-bold text-[15px] ${activeTab === "completed" ? "text-green-600" : "text-[#1a365d]"}`}>
              Completed Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("cancelled")}
            className={`flex-1 py-3.5 rounded-xl items-center justify-center ${activeTab === "cancelled" ? "bg-red-100" : "bg-transparent"}`}
          >
            <Text className={`font-bold text-[15px] ${activeTab === "cancelled" ? "text-red-600" : "text-[#1a365d]"}`}>
              Cancelled Jobs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Button */}
        <View className="flex-row justify-end mb-6">
          <TouchableOpacity className="flex-row items-center border border-blue-200 rounded-full pl-5 pr-1.5 py-1.5 bg-white shadow-sm">
            <Text className="text-blue-500 font-semibold mr-3">View analytics</Text>
            <View className="bg-blue-600 w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="bar-chart" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {activeTab === "completed" && DUMMY_COMPLETED_JOBS.length > 0 ? (
          DUMMY_COMPLETED_JOBS.map(renderJobCard)
        ) : activeTab === "completed" ? (
          <View className="flex-1 items-center justify-center mt-20">
             <Text className="text-gray-500 font-medium">No Records Found</Text>
          </View>
        ) : null}

        {activeTab === "cancelled" && DUMMY_CANCELLED_JOBS.length > 0 ? (
          DUMMY_CANCELLED_JOBS.map(renderJobCard)
        ) : activeTab === "cancelled" ? (
          <View className="flex-1 items-center justify-center mt-20">
             <Text className="text-gray-500 font-medium">No Records Found</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
