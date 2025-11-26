import { Card } from '@/components/Card'; // Import the new Card component
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

// IMPORTANT: Replace with your computer's local IP address
const API_URL = 'https://carleen-unabject-myrtle.ngrok-free.dev';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user from AuthContext
  const userId = user?.userId; // Safely access userId
  const [history, setHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchHistory();
      fetchTemplates();
    } else {
      // This else block might not be necessary anymore with the root layout handling redirection
      // but as a safeguard, we'll keep it from doing a broken redirect.
      console.log("No user ID found, waiting for redirect.");
    }
  }, [userId]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`${API_URL}/api/plans/history?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.history);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      Alert.alert("Error", "Failed to load history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await fetch(`${API_URL}/api/templates`);
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      Alert.alert("Error", "Failed to load templates.");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <Card
      onPress={() => router.push({ pathname: '/plan', params: { planId: item.id, userId: userId } })}
      style={styles.card}
    >
      <ThemedText type="subtitle">{item.topic}</ThemedText>
      <Text>Grade: {item.grade}, Subject: {item.subject}</Text>
      <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </Card>
  );

  const renderTemplateItem = ({ item }) => (
    <Card
      onPress={() => router.push({ pathname: '/create', params: { ...item, userId: userId } })}
      style={styles.card}
    >
      <ThemedText type="subtitle">{item.name}</ThemedText>
      <Text>Grade: {item.grade}, Subject: {item.subject}</Text>
      <Text>{item.description}</Text>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#FDECC8', '#A2D5F2']}
        style={styles.headerContainer}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
      >
        <ThemedText type="title" style={styles.headerTitle}>Dashboard</ThemedText>
      </LinearGradient>

      <View style={styles.content}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Your Generated Plans</ThemedText>
        {loadingHistory ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : history.length > 0 ? (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
        ) : (
          <Text>No plans generated yet.</Text>
        )}
      </View>

      <View style={styles.content}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Lesson Plan Templates</ThemedText>
        {loadingTemplates ? (
          <ActivityIndicator size="large" color="#28A745" />
        ) : templates.length > 0 ? (
          <FlatList
            data={templates}
            renderItem={renderTemplateItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
        ) : (
          <Text>No templates available.</Text>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set a background for the main screen
  },
  headerContainer: {
    padding: 20,
    paddingTop: 50, // Add padding to avoid overlap with status bar
  },
  headerTitle: {
    textAlign: 'center',
    color: '#000', // Set text color to be visible on the gradient
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  list: {
    maxHeight: 220, // Limit height for scrollability
  },
  card: {
    marginBottom: 10, // Add margin between cards
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
