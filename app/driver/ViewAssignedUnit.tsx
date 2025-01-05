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
  rateFrequency: string;
  ownerId: string;
  cashIn: number;
  cashOut: number;
  cashFlow: number;
  dateCreated: { seconds: number };
  dateUpdated: { seconds: number };
}

export default function ViewAssignedUnit() {
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);
  const { id } = useLocalSearchParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const fetchUnitAndOwner = async () => {
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

        // Fetch unit details
        const unitRef = doc(db, "units", id);
        const unitSnapshot = await getDoc(unitRef);

        if (unitSnapshot.exists()) {
          const unitData = unitSnapshot.data() as Unit;
          setUnit(unitData);

          // Fetch owner's name using ownerId
          const ownerRef = doc(db, "owners", unitData.ownerId);
          const ownerSnapshot = await getDoc(ownerRef);

          if (ownerSnapshot.exists()) {
            const { firstName, lastName } = ownerSnapshot.data();
            setOwnerName(`${firstName} ${lastName}`);
          } else {
            setOwnerName("Unknown Owner");
          }
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
      } finally {
        hideSpinner();
      }
    };

    fetchUnitAndOwner();
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
          <Text style={styles.value}>
            PHP {unit.rate.toFixed(2)} {unit.rateFrequency}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="person" size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.label}>Owner:</Text>
          <Text style={styles.value}>{ownerName}</Text>
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
    </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
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
});
