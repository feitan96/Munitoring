import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function RoleSelectionScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Button title="I am an Owner" onPress={() => router.replace("/OwnerDetails")} />
      <Button title="I am a Driver" onPress={() => router.replace("/DriverDetails")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
