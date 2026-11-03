import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ARTISAN_JOB_REQUESTS, ArtisanJobRequest } from "../../../data/artisans";
import { BaseBottomSheet } from "../common/BaseBottomSheet";

interface AvailableJobsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectJob: (job: ArtisanJobRequest) => void;
  appliedJobIds?: string[];
}

type JobFilterTab = "Nearby" | "Most Recent" | "Highest Pay";

export function AvailableJobsModal({
  visible,
  onClose,
  onSelectJob,
  appliedJobIds = [],
}: AvailableJobsModalProps) {
  const [jobSearch, setJobSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<JobFilterTab>("Nearby");

  const filteredJobs = ARTISAN_JOB_REQUESTS.filter(
    (job) =>
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.serviceType.toLowerCase().includes(jobSearch.toLowerCase())
  ).sort((a, b) => {
    if (activeFilter === "Highest Pay") {
      return b.budgetNumeric - a.budgetNumeric;
    }
    return 0;
  });

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Available Jobs"
      subtitle="Browse incoming customer requests"
      scrollable
      maxHeight="90%"
    >
      {/* Search Input */}
      <View className="flex-row items-center bg-[#F8FCFF] border border-[#D6ECFA] rounded-full px-4 h-11 mb-3">
        <Ionicons name="search-outline" size={18} color="#7A9BB8" />
        <TextInput
          value={jobSearch}
          onChangeText={setJobSearch}
          placeholder="Search by location or service..."
          placeholderTextColor="#8AA8C4"
          className="flex-1 ml-2 text-[13px] text-[#003B73] h-full"
          style={{ fontFamily: "Poppins-Regular" }}
        />
        {jobSearch.length > 0 && (
          <TouchableOpacity onPress={() => setJobSearch("")}>
            <Ionicons name="close-circle" size={16} color="#7A9BB8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs: Nearby | Most Recent | Highest Pay */}
      <View className="flex-row mb-4">
        {(["Nearby", "Most Recent", "Highest Pay"] as JobFilterTab[]).map(
          (tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-[#EBF7FF] border-[#D0E8F8]"
                }`}
              >
                <Text
                  className={`text-[12px] ${
                    isActive ? "text-white" : "text-[#5B7C99]"
                  }`}
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* Jobs List */}
      <View className="mb-2">
        {filteredJobs.map((job) => {
          const isApplied = appliedJobIds.includes(job.id);
          return (
            <TouchableOpacity
              key={job.id}
              activeOpacity={0.85}
              onPress={() => onSelectJob(job)}
              className="bg-white rounded-2xl p-3 mb-3 border border-[#DCEFFB] flex-row items-center shadow-xs"
            >
              <Image
                source={job.image}
                className="w-20 h-20 rounded-xl bg-primary-50"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text
                  className="text-[14px] text-[#003B73] mb-0.5"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                  numberOfLines={1}
                >
                  {job.title}
                </Text>
                <Text
                  className="text-[13px] text-[#00A8E8] mb-1.5"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  {job.budget}{" "}
                  <Text
                    className="text-[11.5px] text-[#7A9BB8]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    • {job.distance}
                  </Text>
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-[11px] text-[#7A9BB8]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    {job.postedAgo}
                  </Text>
                  <View
                    className={`px-3.5 py-1 rounded-full ${
                      isApplied ? "bg-[#10B981]" : "bg-primary"
                    }`}
                  >
                    <Text
                      className="text-[11px] text-white"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      {isApplied ? "Applied" : "View & Apply"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseBottomSheet>
  );
}

