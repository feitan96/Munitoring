import React from 'react'
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function OwnerLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="Dashboard" options={{ title: "Dashboard", headerShown: false }} />
        <Stack.Screen name="AddUnit" options={{ title: "AddUnit", headerShown: false }} />
        <Stack.Screen name="EditUnit" options={{ title: "EditUnit", headerShown: false }} />
        <Stack.Screen name="ViewUnit" options={{ title: "ViewUnit", headerShown: false }} />
        <Toast />
      </Stack>
      <Toast />
    </>
  );
}
