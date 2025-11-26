import React from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth(); // Use the signOut function from AuthContext

  const handleLogout = () => {
    // In a real app, you would clear the user's session/token here
    signOut(); // Call signOut to update global auth state
    Alert.alert("Logged Out", "You have been successfully logged out.");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Profile</ThemedText>
      <View style={styles.userInfoContainer}>
        <ThemedText type="subtitle">Welcome!</ThemedText>
        <ThemedText>More user settings and information will be available here in the future.</ThemedText>
      </View>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
