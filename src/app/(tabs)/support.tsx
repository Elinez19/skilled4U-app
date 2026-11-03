import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { images } from "../../constants/images";

interface ConversationItem {
  id: string;
  name: string;
  subtitle: string;
  roleLabel: string;
  timeAgo: string;
  avatar: ImageSourcePropType;
  unreadCount?: number;
}

interface ChatMessage {
  id: string;
  sender: "them" | "me";
  text?: string;
  image?: ImageSourcePropType;
  time: string;
}

const CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-emeka",
    name: "Emeka Okafor",
    subtitle: "All done! The leak has been fixed.",
    roleLabel: "Plumber",
    timeAgo: "Just now",
    avatar: images.artisanEmeka,
    unreadCount: 1,
  },
  {
    id: "conv-1",
    name: "Aisha Bello",
    subtitle: "Fix leaking kitchen sink",
    roleLabel: "Client • Home Service",
    timeAgo: "2h ago",
    avatar: images.onboardingCleaner,
  },
  {
    id: "conv-2",
    name: "John Musa",
    subtitle: "Install ceiling fan",
    roleLabel: "Client • Home Service",
    timeAgo: "1d ago",
    avatar: images.artisanTunde,
  },
  {
    id: "conv-3",
    name: "Grace Uche",
    subtitle: "Electrical wiring repair",
    roleLabel: "Client • Home Service",
    timeAgo: "2d ago",
    avatar: images.plumberWork2,
  },
  {
    id: "conv-4",
    name: "Tunde Bello",
    subtitle: "Bathroom tile repair",
    roleLabel: "Carpenter",
    timeAgo: "3d ago",
    avatar: images.artisanTunde,
  },
  {
    id: "conv-5",
    name: "Ngozi Okafor",
    subtitle: "AC installation",
    roleLabel: "Home Cleaner",
    timeAgo: "4d ago",
    avatar: images.onboardingCleaner,
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    sender: "them",
    text: "Hi! I'm on my way to your location. I'll arrive in about 12 minutes.",
    time: "10:48 AM",
  },
  {
    id: "m-2",
    sender: "me",
    text: "Great! I'm at the front gate.",
    time: "10:50 AM",
  },
  {
    id: "m-3",
    sender: "them",
    text: "Perfect! See you soon.",
    time: "10:50 AM",
  },
  {
    id: "m-4",
    sender: "them",
    image: images.jobSinkRepair,
    time: "11:32 AM",
  },
  {
    id: "m-5",
    sender: "them",
    text: "All done! The leak has been fixed. Let me know if you need anything else.",
    time: "11:35 AM",
  },
  {
    id: "m-6",
    sender: "me",
    text: "Awesome! Thank you so much!",
    time: "11:36 AM",
  },
];

export default function MessagesScreen() {
  const [role, setRole] = useState<"customer" | "artisan">("customer");
  const [activeConversation, setActiveConversation] =
    useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(
    INITIAL_CHAT_MESSAGES
  );
  const [inputText, setInputText] = useState("");

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

  const handleSendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: trimmed,
      time: "11:38 AM",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  // ============================================================
  // LIVE CHAT SCREEN
  // Matches skilled4-customer-chatting-screen-1.png
  // ============================================================
  if (activeConversation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <Image
          source={images.onboardingBg}
          style={styles.bgOverlay}
          resizeMode="cover"
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Top Chat Header */}
          <View className="flex-row items-center justify-between px-5 py-3 bg-white/90 border-b border-[#DCEFFB]">
            <View className="flex-row items-center flex-1 mr-3">
              <TouchableOpacity
                onPress={() => setActiveConversation(null)}
                className="w-9 h-9 rounded-full items-center justify-center mr-2"
              >
                <Ionicons name="arrow-back" size={22} color="#003B73" />
              </TouchableOpacity>

              <View className="w-11 h-11 rounded-full overflow-hidden bg-[#E6F7FF] border border-[#B8E2F8]">
                <Image
                  source={activeConversation.avatar}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[16px] text-[#003B73]"
                  style={{ fontFamily: "Poppins-Bold" }}
                  numberOfLines={1}
                >
                  {activeConversation.name}
                </Text>
                <Text
                  className="text-[12px] text-[#5B7C99]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {activeConversation.roleLabel}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                Toast.show({
                  type: "info",
                  text1: `Calling ${activeConversation.name}...`,
                  text2: "+234 812 345 6789",
                })
              }
              className="w-10 h-10 rounded-full bg-[#F0F9FF] border border-[#D6ECFA] items-center justify-center"
            >
              <Ionicons name="call-outline" size={20} color="#003B73" />
            </TouchableOpacity>
          </View>

          {/* Messages ScrollView */}
          <ScrollView
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isMe = msg.sender === "me";

              if (msg.image) {
                return (
                  <View key={msg.id} className="items-end mb-4">
                    <View
                      style={styles.cardShadow}
                      className="w-60 h-40 rounded-2xl overflow-hidden border-2 border-white relative bg-[#E6F7FF]"
                    >
                      <Image
                        source={msg.image}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className="absolute bottom-2 right-2.5 bg-black/45 px-2 py-0.5 rounded-full flex-row items-center">
                        <Text
                          className="text-[10px] text-white mr-1"
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          {msg.time}
                        </Text>
                        <Ionicons
                          name="checkmark-done"
                          size={12}
                          color="#FFFFFF"
                        />
                      </View>
                    </View>
                  </View>
                );
              }

              if (isMe) {
                return (
                  <View key={msg.id} className="items-end mb-3.5">
                    <View
                      style={styles.sentBubbleShadow}
                      className="bg-[#00A8E8] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[78%]"
                    >
                      <Text
                        className="text-[13.5px] text-white"
                        style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
                      >
                        {msg.text}
                      </Text>
                      <View className="flex-row items-center justify-end mt-1">
                        <Text
                          className="text-[10px] text-white/85 mr-1"
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          {msg.time}
                        </Text>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                );
              }

              return (
                <View key={msg.id} className="flex-row items-start mb-3.5">
                  <View className="w-8 h-8 rounded-full overflow-hidden bg-[#E6F7FF] mr-2.5 mt-1">
                    <Image
                      source={activeConversation.avatar}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View
                    style={styles.cardShadow}
                    className="bg-white border border-[#DCEFFB] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[76%]"
                  >
                    <Text
                      className="text-[13.5px] text-[#003B73]"
                      style={{ fontFamily: "Poppins-Regular", lineHeight: 20 }}
                    >
                      {msg.text}
                    </Text>
                    <Text
                      className="text-[10px] text-[#8AA8C4] mt-1"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {msg.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Message Input Bar */}
          <View className="flex-row items-center px-4 py-3 bg-white border-t border-[#DCEFFB]">
            <TouchableOpacity
              onPress={() =>
                Toast.show({
                  type: "info",
                  text1: "Attach Photo",
                  text2: "Share job photos directly in chat.",
                })
              }
              className="w-9 h-9 rounded-full items-center justify-center mr-2"
            >
              <Ionicons name="attach" size={22} color="#5B7C99" />
            </TouchableOpacity>

            <View className="flex-1 flex-row items-center bg-[#F0F9FF] border border-[#D6ECFA] rounded-full px-4 h-11 mr-2.5">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#8AA8C4"
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                className="flex-1 text-[13.5px] text-[#003B73] h-full"
                style={{ fontFamily: "Poppins-Regular" }}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSendMessage}
              style={styles.sentBubbleShadow}
              className="w-11 h-11 rounded-full bg-[#00A8E8] items-center justify-center"
            >
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // MESSAGES CONVERSATION LIST (Screen 7)
  // Matches skilled4-Artisan-Profile-Settings-Screen.png ("7. Messages")
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Image
        source={images.onboardingBg}
        style={styles.bgOverlay}
        resizeMode="cover"
      />

      <View className="flex-row items-center justify-between px-5 pt-3 pb-3">
        <Text
          className="text-[24px] text-[#003B73]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Messages
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveConversation(CONVERSATIONS[0])}
          className="flex-row items-center bg-[#E6F7FF] border border-[#B8E2F8] px-3 py-1.5 rounded-full"
        >
          <Ionicons name="chatbubbles-outline" size={14} color="#0099DF" />
          <Text
            className="text-[11.5px] text-[#003B73] ml-1.5"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Open Active Chat
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.listScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {(role === "artisan" ? CONVERSATIONS.slice(1) : CONVERSATIONS).map(
          (item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => setActiveConversation(item)}
              style={styles.cardShadow}
              className="bg-white rounded-2xl p-4 mb-3 border border-[#DCEFFB] flex-row items-center"
            >
              <View className="w-14 h-14 rounded-full overflow-hidden bg-[#E6F7FF] border border-[#B8E2F8]">
                <Image
                  source={item.avatar}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1 ml-3.5 pr-2">
                <Text
                  className="text-[15.5px] text-[#003B73] mb-0.5"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  {item.name}
                </Text>
                <Text
                  className="text-[13px] text-[#5B7C99]"
                  style={{ fontFamily: "Poppins-Regular" }}
                  numberOfLines={2}
                >
                  {item.subtitle}
                </Text>
              </View>

              <View className="items-end justify-between self-stretch py-0.5">
                <Text
                  className="text-[11.5px] text-[#7A9BB8]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {item.timeAgo}
                </Text>
                {item.unreadCount ? (
                  <View className="w-5 h-5 rounded-full bg-[#00A8E8] items-center justify-center mt-2">
                    <Text
                      className="text-[10px] text-white"
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {item.unreadCount}
                    </Text>
                  </View>
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color="#94B2CC"
                  />
                )}
              </View>
            </TouchableOpacity>
          )
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
  listScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  chatScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
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
  sentBubbleShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0088CC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
