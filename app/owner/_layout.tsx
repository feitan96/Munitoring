import { Stack } from "expo-router";

export default function OwnerLayout() {
  return (
    <Stack>
      <Stack.Screen name="Dashboard" options={{ title: "Dashboard" }} />
    </Stack>
  );
}
