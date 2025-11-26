import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

// IMPORTANT: Replace with your computer's local IP address
const API_URL = 'https://carleen-unabject-myrtle.ngrok-free.dev';

const FormScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // Get all params
  const userId = params.userId;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    teacher: '',
    gradeLevel: params.grade || '',
    subject: params.subject || '',
    quarter: '',
    week: '',
    day: '',
    date: '',
    learningCompetencies: '', // This field is not sent to backend for generation, but kept for form state
    topic: params.topic || '',
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleGenerate = async () => {
    if (!userId) {
      Alert.alert("Error", "User not logged in. Please log in again.");
      router.replace('/LoginScreen');
      return;
    }

    const { gradeLevel, subject, topic } = formData;

    if (!gradeLevel || !subject || !topic) {
      Alert.alert('Missing Information', 'Please fill in Grade Level, Subject, and Topic to generate a plan.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          grade: gradeLevel,
          subject,
          topic,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const generatedContent = data.plan; // Backend now returns the full plan string
        const fullFormData = {
          ...formData,
          plan_content: generatedContent, // Store the full generated plan
        };
        router.push({ pathname: '/plan', params: { formData: JSON.stringify(fullFormData) } });
      } else {
        Alert.alert('Generation Failed', data.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Error during plan generation:', error);
      Alert.alert('Error', 'Failed to connect to the server or an unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Header Information</Text>
      <TextInput style={styles.input} placeholder="School" onChangeText={(value) => handleInputChange('school', value)} />
      <TextInput style={styles.input} placeholder="Teacher" onChangeText={(value) => handleInputChange('teacher', value)} />
      <TextInput style={styles.input} placeholder="Grade Level" value={formData.gradeLevel} onChangeText={(value) => handleInputChange('gradeLevel', value)} />
      <TextInput style={styles.input} placeholder="Subject" value={formData.subject} onChangeText={(value) => handleInputChange('subject', value)} />
      <TextInput style={styles.input} placeholder="Quarter" onChangeText={(value) => handleInputChange('quarter', value)} />
      <TextInput style={styles.input} placeholder="Week" onChangeText={(value) => handleInputChange('week', value)} />
      <TextInput style={styles.input} placeholder="Day" onChangeText={(value) => handleInputChange('day', value)} />
      <TextInput style={styles.input} placeholder="Date" onChangeText={(value) => handleInputChange('date', value)} />

      <Text style={styles.header}>I. Objectives</Text>
      <TextInput style={styles.textArea} placeholder="Learning competencies (MELCs)" multiline value={formData.learningCompetencies} onChangeText={(value) => handleInputChange('learningCompetencies', value)} />

      <Text style={styles.header}>II. Content</Text>
      <TextInput style={styles.input} placeholder="Topic / Lesson Title" value={formData.topic} onChangeText={(value) => handleInputChange('topic', value)} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Generate Lesson Plan"
          onPress={handleGenerate}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  disclaimer: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 20,
  },
});

export default FormScreen;
