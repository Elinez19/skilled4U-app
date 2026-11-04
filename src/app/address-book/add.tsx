import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddressManagerView } from "../../components/location/AddressManagerView";

export default function AddAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    role?: "customer" | "artisan";
    title?: string;
  }>();

  const role = params.role === "artisan" ? "artisan" : "customer";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <AddressManagerView
          role={role}
          initialStep="add"
          titleOverride={params.title}
          primaryButtonLabel={role === "artisan" ? "Save Service Location" : "Save Address"}
          onClose={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/address-book");
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
