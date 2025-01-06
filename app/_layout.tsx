import React, { createContext, useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

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
        {isSpinnerVisible && (
          <View style={styles.spinnerOverlay}>
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          </View>
        )}
      </View>
    </SpinnerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
  },
});

