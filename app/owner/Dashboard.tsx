import React, { useContext, useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, ScrollView, RefreshControl } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../../firebase";
import { router, usePathname  } from "expo-router";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { SpinnerContext } from "../_layout";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

interface Unit {
  id: string;
  name: string;
  type: string;
  rate: number;
  rateFrequency: string;
  ownerId: string;
}

type SortOrder = "none" | "lowToHigh" | "highToLow";
type UnitType = "tricycle" | "e-bike" | "truck" | "others" | null;

export default function Dashboard() {
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<UnitType>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [fullName, setFullName] = useState<string | null>(null);
  const user = auth.currentUser;
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.replace("/SignIn");
    } else {
      fetchUserFullName();
    }
    fetchUnits();
  }, []);

  const fetchUserFullName = async () => {
    try {
      showSpinner();
      if (!user) {
        console.error("User is not authenticated");
        return;
      }
      const userDoc = await getDoc(doc(db, "owners", user.uid));
      if (userDoc.exists()) {
        const { firstName, lastName } = userDoc.data();
        setFullName(`${firstName} ${lastName}`); // Combine firstName and lastName
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      hideSpinner();
    }
  };

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
          rateFrequency: data.rateFrequency || "Daily",
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

  const filteredAndSortedUnits = useMemo(() => {
    return units
      .filter(unit => {
        const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !selectedType || unit.type === selectedType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortOrder === "lowToHigh") return a.rate - b.rate;
        if (sortOrder === "highToLow") return b.rate - a.rate;
        return 0;
      });
  }, [units, searchQuery, selectedType, sortOrder]);

  const unitTypes: UnitType[] = ["tricycle", "e-bike", "truck", "others"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {fullName ? fullName : "Owner"}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search units by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.muted}
        />
      </View>

      {/* Filters and Sort Section */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilters}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedType && styles.filterChipActive
            ]}
            onPress={() => setSelectedType(null)}
          >
            <Text style={[
              styles.filterChipText,
              !selectedType && styles.filterChipTextActive
            ]}>All</Text>
          </TouchableOpacity>
          {unitTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedType === type && styles.filterChipActive
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[
                styles.filterChipText,
                selectedType === type && styles.filterChipTextActive
              ]}>{type ? type.charAt(0).toUpperCase() + type.slice(1) : ""}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Picker
            selectedValue={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}
            style={styles.picker}
          >
            <Picker.Item label="Sort by rate" value="none" />
            <Picker.Item label="Lowest to Highest" value="lowToHigh" />
            <Picker.Item label="Highest to Lowest" value="highToLow" />
          </Picker>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push("/owner/AddUnit")}
      >
        <Ionicons name="add-circle-outline" size={24} color={colors.background} />
        <Text style={styles.addButtonText}>Add New Unit</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredAndSortedUnits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.unitCard}>
            <Text style={styles.unitName}>{item.name}</Text>
            <View style={styles.unitDetails}>
              <View style={styles.typeTag}>
                <Text style={styles.typeTagText}>{item.type}</Text>
              </View>
              <Text style={styles.unitInfo}>PHP {item.rate.toFixed(2)} {item.rateFrequency}</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]} 
                onPress={() => router.push(`/owner/ViewUnit?id=${item.id}`)}
              >
                <Ionicons name="eye-outline" size={20} color={colors.background} />
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]} 
                onPress={() => router.push(`/owner/EditUnit?id=${item.id}`)}
              >
                <Ionicons name="create-outline" size={20} color={colors.background} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]} 
                onPress={() => confirmDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color={colors.background} />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyStateText}>No units found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchUnits} colors={[colors.primary]} />
        }
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this unit?</Text>
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  primary: "#393E46",    // Dark grayish blue
  secondary: "#6D9886",  // Sage green
  background: "#F7F7F7", // Pure off-white
  card: "#F2E7D5",      // Warm beige
  text: "#393E46",      // Dark grayish blue
  muted: "#6D9886",     // Sage green
  border: "#F2E7D5",    // Warm beige
  danger: "#393E46",    // Dark grayish blue
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  logoutButton: {
    padding: 8,
  },
  controlsContainer: {
    overflow: 'hidden',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: colors.background,
    fontWeight: '600',
    marginLeft: 8,
  },
  unitCard: { 
    padding: 16, 
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unitName: { 
    fontSize: 20, 
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  unitInfo: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 4,
  },
  buttonGroup: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: colors.background,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: colors.secondary,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.muted,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 24,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 16,
    color: colors.text,
  },
  modalText: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonGroup: { 
    flexDirection: "row", 
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: { 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: { 
    backgroundColor: colors.muted,
  },
  confirmButton: { 
    backgroundColor: colors.danger,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterSection: {
    marginBottom: 16,
  },
  typeFilters: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.muted,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.background,
  },
  sortContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    color: colors.text,
  },
  unitDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeTag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTagText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
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

