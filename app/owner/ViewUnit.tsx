import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams, router } from "expo-router";

export default function ViewUnit() {
  const { id } = useLocalSearchParams(); // Fetch route parameters
  const [unit, setUnit] = useState<{ [key: string]: any } | null>(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        if (!id || typeof id !== "string") {
          Alert.alert("Error", "Invalid unit ID.");
          return;
        }
        const docRef = doc(db, "units", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setUnit(snapshot.data());
        } else {
          Alert.alert("Error", "Unit not found.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch unit details.");
      }
    };

    fetchUnit();
  }, [id]);

  if (!unit) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{unit.name}</Text>
      <Text>Type: {unit.type}</Text>
      <Text>Description: {unit.description}</Text>
      <Text>Rate: PHP {unit.rate}/day</Text>
      <Text>Driver Assigned: {unit.driverAssigned || "None"}</Text>
      <Text>Cash In: {unit.cashIn}</Text>
      <Text>Cash Out: {unit.cashOut}</Text>
      <Text>Cash Flow: {unit.cashFlow}</Text>
      <Text>Date Created: {new Date(unit.dateCreated.seconds * 1000).toLocaleDateString()}</Text>
      <Text>Date Updated: {new Date(unit.dateUpdated.seconds * 1000).toLocaleDateString()}</Text>
      <Button title="Back to Dashboard" onPress={() => router.replace("/owner/Dashboard")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
});
