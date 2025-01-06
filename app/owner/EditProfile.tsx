import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Toast from "react-native-toast-message";
import { SpinnerContext } from "../_layout";

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
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={false} // Email should not be editable
      />
      <Button title="Save" onPress={handleSave} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});