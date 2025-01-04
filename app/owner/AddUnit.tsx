import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export default function AddUnit() {
  const [name, setName] = useState("");
  const [type, setType] = useState("tricycle");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

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

    const user = auth.currentUser;

    if (!user) {
      Toast.show({
        type: "error",
        text1: "Authentication Error",
        text2: "User not authenticated.",
      });
      return;
    }

    try {
      const ownerName = `${user.displayName || "Owner"}`;
      await addDoc(collection(db, "units"), {
        ownerId: user.uid,
        ownerName,
        name,
        type,
        description,
        rate: parseFloat(rate),
        driverAssigned: null,
        dateCreated: serverTimestamp(),
        dateUpdated: serverTimestamp(),
        cashIn: 0,
        cashOut: 0,
        cashFlow: 0,
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Unit added successfully!",
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Unit</Text>
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
      <Button title="Save Unit" onPress={handleSave} />
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
