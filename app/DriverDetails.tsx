import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

export default function DriverDetailsScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSignUp = async () => {
    if (!name || !email || !password || !licenseNumber || !phoneNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "driver",
        licenseNumber,
        phoneNumber,
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Driver account created successfully",
      });

      router.replace("/driver/Home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message,
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Driver Sign Up</Text>
        <Text style={styles.subtitle}>Please fill in your details</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color={colors.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color={colors.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color={colors.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={24} color={colors.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={24} color={colors.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={colors.muted}
          />
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/SignIn")}>
          <Text style={styles.signInLink}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  signUpButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "600",
  },
  signInLink: {
    marginTop: 16,
    textAlign: "center",
    color: colors.primary,
    fontSize: 16,
  },
});

