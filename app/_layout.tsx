import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
      <Stack.Screen name="index" options={{ headerShown: false  }} />
    </Stack>
  );
}
