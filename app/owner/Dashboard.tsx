import { Text, View } from "react-native";
import { auth } from "../../firebase";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const user = auth.currentUser; 
    if (!user) {
      router.replace("/SignIn"); // Redirect to SignIn if not authenticated
    }
  }, []);

  return (
    <View>
      <Text>Welcome, Owner!</Text>
    </View>
  );
}
