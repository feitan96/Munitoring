import React, { useEffect, useState, useContext, useMemo } from "react";
import { Text, View, FlatList, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { auth, db } from "../../firebase";
import { router } from "expo-router";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { SpinnerContext } from "../_layout";
import { Picker } from "@react-native-picker/picker";

interface Unit {
  id: string;
  name: string;
  type: string;
  rate: number;
  rateFrequency: string;
  description: string;
}

type SortOrder = "none" | "lowToHigh" | "highToLow";
type UnitType = "tricycle" | "e-bike" | "truck" | "others" | null;

export default function Home() {
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);
  const [units, setUnits] = useState<Unit[]>([]);
  const [driverName, setDriverName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<UnitType>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        showSpinner();
        const user = auth.currentUser;

        if (!user) {
          router.replace("/SignIn");
          return;
        }

        // Fetch driver's full name
        const driverRef = doc(db, "drivers", user.uid);
        const driverSnapshot = await getDoc(driverRef);

        if (driverSnapshot.exists()) {
          const { firstName, lastName } = driverSnapshot.data();
          setDriverName(`${firstName} ${lastName}`);
        } else {
          setDriverName("Driver");
        }

        // Query units assigned to the logged-in driver
        const q = query(collection(db, "units"), where("driverAssigned", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const assignedUnits = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            type: data.type || "",
            rate: data.rate || 0,
            rateFrequency: data.rateFrequency || "",
            description: data.description || "",
          };
        });

        setUnits(assignedUnits);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch data.",
        });
      } finally {
        hideSpinner();
      }
    };

    fetchDriverDetails();
  }, []);

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

  const renderUnitItem = ({ item }: { item: Unit }) => (
    <View style={styles.unitCard}>
      <Text style={styles.unitName}>{item.name}</Text>
      <View style={styles.unitDetails}>
        <View style={styles.typeTag}>
          <Text style={styles.typeTagText}>{item.type}</Text>
        </View>
        <Text style={styles.unitInfo}>PHP {item.rate}/{item.rateFrequency}</Text>
      </View>
      <TouchableOpacity 
        style={styles.viewButton} 
        onPress={() => router.push(`/driver/ViewAssignedUnit?id=${item.id}`)}
      >
        <Ionicons name="eye-outline" size={20} color={colors.background} />
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {driverName}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

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

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilters}>
          <TouchableOpacity
            style={[styles.filterChip, !selectedType && styles.filterChipActive]}
            onPress={() => setSelectedType(null)}
          >
            <Text style={[styles.filterChipText, !selectedType && styles.filterChipTextActive]}>All</Text>
          </TouchableOpacity>
          {unitTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextActive]}>
                {type ? type.charAt(0).toUpperCase() + type.slice(1) : ""}
              </Text>
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

      {filteredAndSortedUnits.length > 0 ? (
        <FlatList
          data={filteredAndSortedUnits}
          renderItem={renderUnitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.unitList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyStateText}>No assigned units found</Text>
        </View>
      )}
    </View>
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
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  logoutButton: {
    padding: 8,
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
  unitList: {
    paddingBottom: 16,
  },
  unitCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    shadowColor: colors.text,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unitName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
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
  unitInfo: {
    fontSize: 16,
    color: colors.muted,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.muted,
    textAlign: "center",
  },
});

