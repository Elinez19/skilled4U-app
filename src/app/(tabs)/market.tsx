import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MarketScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
      <Text className="text-xl font-bold">Market</Text>
    </SafeAreaView>
  );
}
