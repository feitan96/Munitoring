import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList, TouchableOpacity } from "react-native";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp, DocumentData } from "firebase/firestore";
import { useLocalSearchParams, router } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

interface UnitType {
  label: string;
  value: string;
  icon: string;
}

const unitTypes: UnitType[] = [
  { label: "Tricycle", value: "tricycle", icon: "bicycle" },
  { label: "E-bike", value: "e-bike", icon: "bicycle-outline" },
  { label: "Truck", value: "truck", icon: "car" },
  { label: "Others", value: "others", icon: "ellipsis-horizontal" },
];

export default function EditUnit() {
  const { id } = useLocalSearchParams();
  const [unit, setUnit] = useState<DocumentData | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<UnitType>(unitTypes[0]);
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isTypePickerVisible, setIsTypePickerVisible] = useState(false);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
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
          const data = snapshot.data();
          setUnit(data);
          setName(data.name);
          setType(unitTypes.find(t => t.value === data.type) || unitTypes[0]);
          setDescription(data.description);
          setRate(data.rate.toString());
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
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid unit ID.",
        });
        return;
      }
      const docRef = doc(db, "units", id);
      await updateDoc(docRef, {
        name,
        type: type.value,
        description,
        rate: parseFloat(rate),
        dateUpdated: serverTimestamp(),
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Unit edited successfully!",
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

  const renderTypeItem = ({ item }: { item: UnitType }) => (
    <TouchableOpacity
      style={styles.typeItem}
      onPress={() => {
        setType(item);
        setIsTypePickerVisible(false);
      }}
    >
      <Ionicons name={item.icon as any} size={24} color={colors.primary} style={styles.typeIcon} />
      <Text style={styles.typeLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  if (!unit) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Unit</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="Enter unit name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.muted}
          />
          {errors.name && <Text style={styles.errorText}>Please enter a unit name.</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit Type</Text>
          <TouchableOpacity
            style={[styles.pickerButton, errors.type && styles.errorInput]}
            onPress={() => setIsTypePickerVisible(true)}
          >
            <Ionicons name={type.icon as any} size={24} color={colors.primary} style={styles.pickerIcon} />
            <Text style={styles.pickerButtonText}>{type.label}</Text>
            <Ionicons name="chevron-down" size={24} color={colors.primary} />
          </TouchableOpacity>
          {errors.type && <Text style={styles.errorText}>Please select a type.</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.errorInput]}
            placeholder="Enter unit description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.muted}
          />
          {errors.description && <Text style={styles.errorText}>Please enter a description.</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rate (PHP)</Text>
          <TextInput
            style={[styles.input, errors.rate && styles.errorInput]}
            placeholder="Enter rate"
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
            placeholderTextColor={colors.muted}
          />
          {errors.rate && <Text style={styles.errorText}>Please enter a valid rate.</Text>}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isTypePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsTypePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Unit Type</Text>
            <FlatList
              data={unitTypes}
              renderItem={renderTypeItem}
              keyExtractor={(item) => item.value}
              style={styles.typeList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsTypePickerVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  pickerIcon: {
    marginRight: 12,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  typeList: {
    marginBottom: 16,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeIcon: {
    marginRight: 16,
  },
  typeLabel: {
    fontSize: 16,
    color: colors.text,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

