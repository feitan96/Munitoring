import React from 'react'
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function OwnerLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="Dashboard" options={{ title: "Dashboard" }} />
        <Stack.Screen name="AddUnit" options={{ title: "AddUnit" }} />
        <Stack.Screen name="EditUnit" options={{ title: "EditUnit" }} />
        <Stack.Screen name="ViewUnit" options={{ title: "ViewUnit" }} />
        <Toast />
      </Stack>
      <Toast />
    </>
  );
}
