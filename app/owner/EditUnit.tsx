import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp, DocumentData } from "firebase/firestore";
import { useLocalSearchParams, router } from "expo-router";
import Toast from "react-native-toast-message";

export default function EditUnit() {
  const { id } = useLocalSearchParams();
  const [unit, setUnit] = useState<DocumentData | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("tricycle");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

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
          const data = snapshot.data();
          setUnit(data);
          setName(data.name);
          setType(data.type);
          setDescription(data.description);
          setRate(data.rate.toString());
        } else {
          Alert.alert("Error", "Unit not found.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch unit details.");
      }
    };

    fetchUnit();
  }, [id]);

  const validateFields = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!name) newErrors.name = true;
    if (!type) newErrors.type = true;
    if (!description) newErrors.description = true;
    if (!rate || isNaN(parseFloat(rate))) newErrors.rate = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    try {
      if (!id || typeof id !== "string") {
        Alert.alert("Error", "Invalid unit ID.");
        return;
      }
      const docRef = doc(db, "units", id);
      await updateDoc(docRef, {
        name,
        type,
        description,
        rate: parseFloat(rate),
        dateUpdated: serverTimestamp(),
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Unit editied successfully!",
      });
      router.replace("/owner/Dashboard");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message,
      });
    }
  };

  if (!unit) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Unit</Text>
      <TextInput
        style={[styles.input, errors.name && styles.errorInput]}
        placeholder="Unit Name"
        value={name}
        onChangeText={setName}
      />
      <Picker selectedValue={type} onValueChange={setType} style={styles.picker}>
        <Picker.Item label="Tricycle" value="tricycle" />
        <Picker.Item label="E-bike" value="e-bike" />
        <Picker.Item label="Truck" value="truck" />
        <Picker.Item label="Others" value="others" />
      </Picker>
      {errors.type && <Text style={styles.errorText}>Please select a type.</Text>}
      <TextInput
        style={[styles.input, errors.description && styles.errorInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={[styles.input, errors.rate && styles.errorInput]}
        placeholder="Rate (PHP)"
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, padding: 12, marginBottom: 16 },
  picker: { height: 50, marginBottom: 16 },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginBottom: 8 },
});
