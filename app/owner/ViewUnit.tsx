import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { SpinnerContext } from "../_layout";

interface Unit {
  name: string;
  type: string;
  description: string;
  rate: number;
  driverAssigned: string | null;
  cashIn: number;
  cashOut: number;
  cashFlow: number;
  dateCreated: { seconds: number };
  dateUpdated: { seconds: number };
}

export default function ViewUnit() {
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);
  const { id } = useLocalSearchParams();
  const [unit, setUnit] = useState<Unit | null>(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        showSpinner();
        if (!id || typeof id !== "string") {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid unit ID.",
          });
          return;
        }
        const docRef = doc(db, "units", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setUnit(snapshot.data() as Unit);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Unit not found.",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch unit details.",
        });
      }finally {
        hideSpinner();
      }
    };

    fetchUnit();
  }, [id]);

  if (!unit) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{unit.name}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="car" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{unit.type}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="document-text" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{unit.description}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="cash" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Rate:</Text>
          <Text style={styles.value}>PHP {unit.rate}/day</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="person" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Driver Assigned:</Text>
          <Text style={styles.value}>{unit.driverAssigned || "None"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Financial Summary</Text>
        <View style={styles.row}>
          <Ionicons name="arrow-up-circle" size={24} color={colors.secondary} style={styles.icon} />
          <Text style={styles.label}>Cash In:</Text>
          <Text style={styles.value}>PHP {unit.cashIn.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="arrow-down-circle" size={24} color={colors.danger} style={styles.icon} />
          <Text style={styles.label}>Cash Out:</Text>
          <Text style={styles.value}>PHP {unit.cashOut.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="swap-vertical" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Cash Flow:</Text>
          <Text style={[styles.value, unit.cashFlow >= 0 ? styles.positive : styles.negative]}>
            PHP {unit.cashFlow.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dates</Text>
        <View style={styles.row}>
          <Ionicons name="calendar" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>
            {new Date(unit.dateCreated.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Updated:</Text>
          <Text style={styles.value}>
            {new Date(unit.dateUpdated.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/owner/EditUnit?id=${id}`)}
      >
        <Ionicons name="create" size={24} color={colors.background} />
        <Text style={styles.editButtonText}>Edit Unit</Text>
      </TouchableOpacity>
    </ScrollView>
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
  danger: "#E74C3C",     // Red for errors
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: 120,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  positive: {
    color: colors.secondary,
  },
  negative: {
    color: colors.danger,
  },
  editButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  editButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

