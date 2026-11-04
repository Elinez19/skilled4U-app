import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddressFlowStep, AddressManagerView } from "../../components/location/AddressManagerView";

export default function AddressBookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    role?: "customer" | "artisan";
    step?: AddressFlowStep;
    title?: string;
  }>();

  const role = params.role === "artisan" ? "artisan" : "customer";
  const initialStep: AddressFlowStep = params.step || "list";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <AddressManagerView
          role={role}
          initialStep={initialStep}
          titleOverride={params.title}
          primaryButtonLabel={role === "artisan" ? "Confirm Service Area" : "Finish Account Setup"}
          onClose={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
          onAddressConfirmed={(addr) => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
          showBackButton={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FAFF",
  },
  container: {
    flex: 1,
  },
});
