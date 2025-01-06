import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { auth } from "../../firebase";
import Toast from "react-native-toast-message";

export default function Settings() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/SignIn");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to log out.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => router.push("/owner/EditProfile")}
          >
            <Text style={styles.settingText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Email Notifications</Text>
            <Switch />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Currency</Text>
            <Text style={styles.settingValue}>PHP</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={[styles.menuItem, pathname === "/owner/Dashboard" && styles.activeMenuItem]}
          onPress={() => router.push("/owner/Dashboard")}
        >
          <Ionicons name="grid-outline" size={24} color={pathname === "/owner/Dashboard" ? colors.primary : colors.muted} />
          <Text style={[styles.menuItemText, pathname === "/owner/Dashboard" && styles.activeMenuItemText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, pathname === "/owner/Analytics" && styles.activeMenuItem]}
          onPress={() => router.push("/owner/Analytics")}
        >
          <Ionicons name="bar-chart-outline" size={24} color={pathname === "/owner/Analytics" ? colors.primary : colors.muted} />
          <Text style={[styles.menuItemText, pathname === "/owner/Analytics" && styles.activeMenuItemText]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, pathname === "/owner/Settings" && styles.activeMenuItem]}
          onPress={() => router.push("/owner/Settings")}
        >
          <Ionicons name="settings-outline" size={24} color={pathname === "/owner/Settings" ? colors.primary : colors.muted} />
          <Text style={[styles.menuItemText, pathname === "/owner/Settings" && styles.activeMenuItemText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const colors = {
  primary: "#393E46",
  secondary: "#6D9886",
  background: "#F7F7F7",
  card: "#F2E7D5",
  text: "#393E46",
  muted: "#6D9886",
  border: "#F2E7D5",
  danger: "#E74C3C",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Add padding to account for bottom menu
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  settingValue: {
    fontSize: 16,
    color: colors.muted,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  activeMenuItem: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  activeMenuItemText: {
    color: colors.primary,
  },
});
