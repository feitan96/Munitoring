import { Stack } from "expo-router";

export default function DriverLayout() {
  return (
    <Stack>
      <Stack.Screen name="Home" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="ViewAssignedUnit" options={{ title: "ViewAssignedUnit", headerShown: false }} />
    </Stack>
  );
}