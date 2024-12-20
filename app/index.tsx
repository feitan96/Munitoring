import { router } from "expo-router";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {

  useEffect(() => {
    // Delay redirection to allow the navigation stack to mount
    const timer = setTimeout(() => {
      router.replace("/SignIn");
    }, 100);

    return () => clearTimeout(timer); // Clean up timer
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Redirecting...</Text>
    </View>
  );
}
