import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Toast from "react-native-toast-message";
import { SpinnerContext } from "../_layout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        setLoading(true);
        showSpinner();
        try {
          const userDoc = await getDoc(doc(db, "owners", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setContactNumber(data.contactNumber);
            setAddress(data.address);
            setEmail(data.email);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Fetch Error",
            text2: "Failed to fetch user profile.",
          });
        } finally {
          setLoading(false);
          hideSpinner();
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      setLoading(true);
      showSpinner();
      try {
        const userDocRef = doc(db, "owners", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const existingData = userDoc.data();
          await updateDoc(userDocRef, {
            ...existingData,
            firstName,
            lastName,
            contactNumber,
            address,
            email,
            updatedAt: serverTimestamp(),
          });
          Toast.show({
            type: "success",
            text1: "Profile Updated",
            text2: "Your profile has been successfully updated.",
          });
          router.back();
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Update Error",
          text2: "Failed to update profile.",
        });
      } finally {
        setLoading(false);
        hideSpinner();
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Owner Profile</Text>
        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />
        <Input
          label="Contact Number"
          placeholder="Enter your contact number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
        <Input
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          style={styles.multilineInput}
        />
        <Input
          label="Email"
          placeholder="Your email address"
          value={email}
          onChangeText={setEmail}
          editable={false}
          style={styles.disabledInput}
        />
        <Button
          title={loading ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={loading}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f7fafc',
  },
  card: {
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: '#2d3748',
    textAlign: 'center',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#edf2f7',
    color: '#718096',
  },
});

