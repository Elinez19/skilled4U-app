import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

interface BookingCalendarProps {
  selectedDate: string; // "YYYY-MM-DD" e.g. "2025-05-14"
  onSelectDate: (dateString: string, formattedDate: string) => void;
  minDate?: string;
  initialMode?: "month" | "strip";
}

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function formatCalendarDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = DAYS_SHORT[date.getDay()] || "";
    const monthName = MONTHS_SHORT[date.getMonth()] || "";
    return `${dayName}, ${day} ${monthName} ${year}`;
  } catch {
    return dateString;
  }
}

function getWeekDaysAround(dateString: string) {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const centerDate = new Date(year, month - 1, day);
    const currentDayOfWeek = centerDate.getDay(); // 0 is Sun
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const days = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + mondayOffset + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dt = String(d.getDate()).padStart(2, "0");
      const iso = `${y}-${m}-${dt}`;
      days.push({
        iso,
        dayLabel: DAYS_SHORT[d.getDay()],
        dateNum: String(d.getDate()),
        fullDate: `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${y}`,
      });
    }
    return days;
  } catch {
    return [
      { iso: "2025-05-12", dayLabel: "Mon", dateNum: "12", fullDate: "Mon, 12 May 2025" },
      { iso: "2025-05-13", dayLabel: "Tue", dateNum: "13", fullDate: "Tue, 13 May 2025" },
      { iso: "2025-05-14", dayLabel: "Wed", dateNum: "14", fullDate: "Wed, 14 May 2025" },
      { iso: "2025-05-15", dayLabel: "Thu", dateNum: "15", fullDate: "Thu, 15 May 2025" },
      { iso: "2025-05-16", dayLabel: "Fri", dateNum: "16", fullDate: "Fri, 16 May 2025" },
      { iso: "2025-05-17", dayLabel: "Sat", dateNum: "17", fullDate: "Sat, 17 May 2025" },
    ];
  }
}

export function BookingCalendar({
  selectedDate,
  onSelectDate,
  minDate = "2025-05-01",
  initialMode = "month",
}: BookingCalendarProps) {
  const [viewMode, setViewMode] = useState<"month" | "strip">(initialMode);

  // Marked dates config for react-native-calendars
  const markedDates = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: "#00A8E8",
        selectedTextColor: "#FFFFFF",
      },
    };
  }, [selectedDate]);

  // Derive header title e.g. "May 2025"
  const currentMonthYear = useMemo(() => {
    try {
      const [year, month] = selectedDate.split("-").map(Number);
      return `${MONTHS_FULL[month - 1]} ${year}`;
    } catch {
      return "May 2025";
    }
  }, [selectedDate]);

  const weekDays = useMemo(() => getWeekDaysAround(selectedDate), [selectedDate]);

  const handleDayPress = (day: DateData) => {
    onSelectDate(day.dateString, formatCalendarDate(day.dateString));
  };

  return (
    <View
      style={styles.cardShadow}
      className="bg-white rounded-2xl border border-[#DCEFFB] overflow-hidden mb-3.5"
    >
      {/* Top Header with Month and View Toggle */}
      <View className="flex-row items-center justify-between px-4 pt-3.5 pb-2 border-b border-[#F0F7FC]">
        <View className="flex-row items-center">
          <Ionicons name="calendar" size={17} color="#0099DF" />
          <Text
            className="text-[14.5px] text-[#003B73] ml-2"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {currentMonthYear}
          </Text>
        </View>

        {/* Toggle between Full Month Calendar & Quick Strip */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setViewMode((prev) => (prev === "month" ? "strip" : "month"))
          }
          className="flex-row items-center bg-primary-50 border border-[#B8E2F8] px-2.5 py-1 rounded-full"
        >
          <Ionicons
            name={viewMode === "month" ? "calendar-outline" : "grid-outline"}
            size={12}
            color="#0099DF"
          />
          <Text
            className="text-[11px] text-[#003B73] ml-1"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            {viewMode === "month" ? "Week View" : "Month View"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main View: React Native Calendars Component OR Week Strip */}
      {viewMode === "month" ? (
        <View className="p-1">
          <Calendar
            current={selectedDate}
            minDate={minDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            enableSwipeMonths
            theme={{
              backgroundColor: "#FFFFFF",
              calendarBackground: "#FFFFFF",
              textSectionTitleColor: "#7A9BB8",
              selectedDayBackgroundColor: "#00A8E8",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#0099DF",
              dayTextColor: "#003B73",
              textDisabledColor: "#C8DFEF",
              arrowColor: "#0099DF",
              monthTextColor: "#003B73",
              indicatorColor: "#0099DF",
              textDayFontFamily: "Poppins-Medium",
              textMonthFontFamily: "Poppins-Bold",
              textDayHeaderFontFamily: "Poppins-Medium",
              textDayFontSize: 13.5,
              textMonthFontSize: 14,
              textDayHeaderFontSize: 11.5,
              stylesheet: {
                calendar: {
                  header: {
                    monthText: {
                      display: "none", // Controlled via clean custom header above
                    },
                  },
                },
              },
            }}
          />
        </View>
      ) : (
        <View className="px-3 py-3">
          <View className="flex-row justify-between">
            {weekDays.map((item) => {
              const isSelected = selectedDate === item.iso;
              return (
                <TouchableOpacity
                  key={item.iso}
                  activeOpacity={0.8}
                  onPress={() => onSelectDate(item.iso, item.fullDate)}
                  className={`w-[15%] py-2.5 rounded-2xl items-center justify-center border ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-white border-[#D6ECFA]"
                  }`}
                >
                  <Text
                    className={`text-[11px] mb-0.5 ${
                      isSelected ? "text-white/90" : "text-[#7A9BB8]"
                    }`}
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {item.dayLabel}
                  </Text>
                  <Text
                    className={`text-[15px] ${
                      isSelected ? "text-white" : "text-[#003B73]"
                    }`}
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    {item.dateNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Selected Date Confirmation Pill */}
      <View className="bg-[#F4FAFF] px-4 py-2 flex-row items-center justify-between border-t border-[#EDF6FD]">
        <Text
          className="text-[11.5px] text-[#5B7C99]"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          Selected Date
        </Text>
        <Text
          className="text-[12px] text-[#0099DF]"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          {formatCalendarDate(selectedDate)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

