import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIME_SLOTS = [
  "09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
];

export default function ScheduleAppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSet, setIsSet] = useState(false);

  const handleSet = () => {
    if (selectedDate && selectedTime) {
      setIsSet(true);
    }
  };

  const handleClear = () => {
    setIsSet(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-2 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 mt-2">
          <Ionicons name="arrow-back" size={28} color="#0D253C" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#0D253C]">Set an Appointment Date</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        {/* Calendar */}
        <Calendar
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#F3F4F6', selectedTextColor: '#0D253C' }
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#00B7FF',
            selectedDayBackgroundColor: '#F3F4F6',
            selectedDayTextColor: '#0D253C',
            todayTextColor: '#00B7FF',
            dayTextColor: '#64748b',
            textDisabledColor: '#cbd5e1',
            arrowColor: '#00B7FF',
            monthTextColor: '#00B7FF',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
          style={{ marginBottom: 10 }}
        />

        {/* Divider */}
        <View className="h-px bg-slate-200 mx-5 mb-6" />

        {/* Message Input */}
        <View className="px-5 mb-6">
          <TextInput
            className="text-[15px] text-slate-600 font-medium"
            placeholder="Type a message"
            placeholderTextColor="#CBD5E1"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {/* Time Slots */}
        <View className="px-5 flex-row flex-wrap gap-2.5">
          {TIME_SLOTS.map((time, idx) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedTime(time)}
                className={`px-4 py-2.5 rounded-full border ${isSelected ? 'border-primary' : 'border-slate-100'} bg-white shadow-sm`}
                style={!isSelected ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 } : {}}
              >
                <Text className={`text-[13px] ${isSelected ? 'text-[#5C71A2]' : 'text-[#0D253C]'}`}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Container */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity 
            onPress={handleSet}
            className="border border-primary rounded-xl px-8 py-2"
          >
            <Text className="text-[#00B7FF] font-medium text-[15px]">Set</Text>
          </TouchableOpacity>
        </View>

        {isSet && (
          <View className="border border-slate-200 rounded-xl p-4 mb-4 relative">
             <Text className="text-[12px] text-slate-400 mb-1 font-medium">Date and Time</Text>
             <Text className="text-[15px] font-bold text-[#0D253C] mb-0.5">{selectedDate}</Text>
             <Text className="text-[15px] font-bold text-[#0D253C]">{selectedTime}</Text>
             <TouchableOpacity onPress={handleClear} className="absolute bottom-4 right-4">
                <Text className="text-slate-500 text-[14px] font-medium">Clear</Text>
             </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity className={`w-full rounded-xl py-3.5 items-center ${isSet ? 'bg-primary' : 'bg-[#93D9FA]'}`}>
          <Text className="text-white font-bold text-[15px]">Submit Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
