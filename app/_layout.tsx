import React, { createContext, useState, useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Modal } from "react-native";
import { Stack } from "expo-router";

export const SpinnerContext = createContext<{
  showSpinner: () => void;
  hideSpinner: () => void;
}>({
  showSpinner: () => {},
  hideSpinner: () => {},
});

export default function RootLayout() {
  const [isSpinnerVisible, setSpinnerVisible] = useState(false);

  const showSpinner = () => setSpinnerVisible(true);
  const hideSpinner = () => setSpinnerVisible(false);

  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="SignIn" options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} />
          <Stack.Screen
            name="RoleSelection"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="OwnerDetails"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="DriverDetails"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen name="owner" options={{ headerShown: false }} />
          <Stack.Screen name="driver" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>

        {/* Global Spinner */}
        <Modal transparent={true} visible={isSpinnerVisible} animationType="fade">
          <View style={styles.spinnerOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </Modal>
      </View>
    </SpinnerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  spinnerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
