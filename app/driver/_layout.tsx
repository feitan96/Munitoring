import { Stack } from "expo-router";

export default function DriverLayout() {
  return (
    <Stack>
      <Stack.Screen name="Home" options={{ title: "Home" }} />
    </Stack>
  );
}
