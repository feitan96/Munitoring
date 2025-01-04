import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet, Modal, Pressable } from "react-native";
import { auth, db } from "../../firebase";
import { router } from "expo-router";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { SpinnerContext } from "../_layout";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  interface Unit {
    id: string;
    name: string;
    type: string;
    rate: number;
    ownerId: string;
  }
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);

  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.replace("/SignIn");
    }
    fetchUnits();
  }, []);

  const handleLogout = async () => {
    try {
      showSpinner();
      await signOut(auth);
      router.replace("/SignIn");
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout Error",
        text2: "Failed to log out. Please try again.",
      });
    } finally {
      hideSpinner();
    }
  };

  const fetchUnits = async () => {
    showSpinner();
    setLoading(true);
    try {
      const unitsCollection = collection(db, "units");
      const snapshot = await getDocs(unitsCollection);
      const fetchedUnits = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          rate: data.rate,
          ownerId: data.ownerId,
        };
      });
      setUnits(fetchedUnits.filter((unit) => user && unit.ownerId === user.uid));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Fetch Error",
        text2: "Failed to fetch units.",
      });
    } finally {
      hideSpinner();
      setLoading(false);
    }
  };

  const confirmDelete = (unitId: string) => {
    setUnitToDelete(unitId);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;

    try {
      await deleteDoc(doc(db, "units", unitToDelete));
      Toast.show({
        type: "success",
        text1: "Deletion Success",
        text2: "Unit deleted successfully!",
      });
      fetchUnits();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Deletion Error",
        text2: "Failed to delete unit.",
      });
    } finally {
      setModalVisible(false);
      setUnitToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, Owner!</Text>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </Pressable>
      </View>
      
      <Button title="Add New Unit" onPress={() => router.push("/owner/AddUnit")} />
      <FlatList
        data={units}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.unitCard}>
            <Text style={styles.unitName}>{item.name}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Rate: PHP {item.rate}/day</Text>
            <View style={styles.buttonGroup}>
              <Button title="View" onPress={() => router.push(`/owner/ViewUnit?id=${item.id}`)} />
              <Button title="Edit" onPress={() => router.push(`/owner/EditUnit?id=${item.id}`)} />
              <Button title="Delete" onPress={() => confirmDelete(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No units found.</Text>}
        refreshing={loading}
        onRefresh={fetchUnits}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text>Are you sure you want to delete this unit?</Text>
            <View style={styles.modalButtonGroup}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 24 
  },
  logoutButton: {
    padding: 8,
  },
  unitCard: { 
    padding: 16, 
    borderWidth: 1, 
    marginBottom: 8 
  },
  unitName: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  buttonGroup: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 8 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  modalButtonGroup: { 
    flexDirection: "row", 
    marginTop: 20 
  },
  modalButton: { 
    padding: 10, 
    borderRadius: 8, 
    marginHorizontal: 5 
  },
  cancelButton: { 
    backgroundColor: "gray" 
  },
  confirmButton: { 
    backgroundColor: "red" 
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
});