import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { SavedAddress } from "../../../services/features/location/addressStorage";
import { AddressFlowStep, AddressManagerView } from "../../location/AddressManagerView";

interface AddressSelectionModalProps {
  visible: boolean;
  role?: "customer" | "artisan";
  initialStep?: AddressFlowStep;
  titleOverride?: string;
  primaryButtonLabel?: string;
  onAddressConfirmed?: (address: SavedAddress) => void;
  onClose: () => void;
}

export function AddressSelectionModal({
  visible,
  role = "customer",
  initialStep = "list",
  titleOverride,
  primaryButtonLabel = "Confirm Address",
  onAddressConfirmed,
  onClose,
}: AddressSelectionModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <AddressManagerView
          role={role}
          initialStep={initialStep}
          titleOverride={titleOverride}
          primaryButtonLabel={primaryButtonLabel}
          onAddressConfirmed={onAddressConfirmed}
          onClose={onClose}
          showBackButton={true}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FAFF",
  },
});
