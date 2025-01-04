import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { SpinnerContext } from "../app/_layout";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);

  const handleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    showSpinner();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Fetch user role from Firestore
      const ownerDoc = await getDoc(doc(db, "owners", userId));
      const driverDoc = await getDoc(doc(db, "drivers", userId));

      if (ownerDoc.exists()) {
        router.replace("/owner/Dashboard"); // Navigate to owner dashboard
      } else if (driverDoc.exists()) {
        router.replace("/driver/Home"); // Navigate to driver home
      } else {
        Alert.alert("Error", "No profile found for this account!");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      hideSpinner();
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color={colors.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color={colors.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push("/RoleSelection")}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.link}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const colors = {
  primary: "#3b82f6",
  background: "#f3f4f6",
  card: "#ffffff",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#e5e7eb",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
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
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    marginTop: 24,
    textAlign: "center",
    color: colors.muted,
    fontSize: 16,
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
  },
});

