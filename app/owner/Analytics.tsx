import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

export default function Analytics() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Analytics</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Revenue</Text>
          <Text style={styles.cardValue}>₱150,000</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Units</Text>
          <Text style={styles.cardValue}>15</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Performing Unit</Text>
          <Text style={styles.cardValue}>Tricycle #007</Text>
          <Text style={styles.cardSubvalue}>Revenue: ₱12,500</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Trend</Text>
          {/* Placeholder for a chart */}
          <View style={styles.chartPlaceholder}>
            <Text>Chart Placeholder</Text>
          </View>
        </View>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  cardSubvalue: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
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
