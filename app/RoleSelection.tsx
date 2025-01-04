import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RoleSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Text style={styles.subtitle}>Choose the option that best describes you</Text>
      
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => router.replace("/OwnerDetails")}
      >
        <Ionicons name="business" size={32} color={colors.primary} style={styles.icon} />
        <View style={styles.roleTextContainer}>
          <Text style={styles.roleTitle}>I am an Owner</Text>
          <Text style={styles.roleDescription}>Manage your fleet and drivers</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => router.replace("/DriverDetails")}
      >
        <Ionicons name="car" size={32} color={colors.primary} style={styles.icon} />
        <View style={styles.roleTextContainer}>
          <Text style={styles.roleTitle}>I am a Driver</Text>
          <Text style={styles.roleDescription}>Drive vehicles and earn money</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const colors = {
  primary: "#393E46",    // Dark grayish blue
  secondary: "#6D9886",  // Sage green
  background: "#F7F7F7", // Pure off-white
  card: "#F2E7D5",       // Warm beige
  text: "#393E46",       // Dark grayish blue
  muted: "#6D9886",      // Sage green
  border: "#F2E7D5",     // Warm beige
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 32,
    textAlign: "center",
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 16,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.muted,
  },
});

