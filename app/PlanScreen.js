import { ThemedText } from '@/components/themed-text'; // Import ThemedText
import { ThemedView } from '@/components/themed-view'; // Import ThemedView
import Collapsible from '@/components/ui/collapsible'; // Import Collapsible
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

// IMPORTANT: Replace with your computer's local IP address
const API_URL = 'https://carleen-unabject-myrtle.ngrok-free.dev'; // Ensure this matches your local IP

const PlanScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (params.planId) {
        // Fetch plan from history
        try {
          const response = await fetch(`${API_URL}/api/plans/${params.planId}`);
          const data = await response.json();
          if (data.success && data.plan) {
            // Assuming plan_content is a JSON string
            const parsedPlanContent = JSON.parse(data.plan.plan_content);
            setPlanData({
              ...data.plan, // Includes grade, subject, topic, created_at
              ...parsedPlanContent, // Includes detailed plan sections
            });
          } else {
            Alert.alert("Error", data.message || "Failed to load historical plan.");
          }
        } catch (error) {
          console.error("Error fetching historical plan:", error);
          Alert.alert("Error", "Failed to connect to server to load historical plan.");
        } finally {
          setIsLoading(false);
        }
      } else if (params.formData) {
        // Plan passed directly from generation
        const parsedFormData = JSON.parse(params.formData);
        setPlanData(parsedFormData);
        setIsLoading(false);
      } else {
        Alert.alert("Error", "No plan data found.");
        router.back();
      }
    };

    fetchPlan();
  }, [params]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Lesson Plan...</Text>
      </View>
    );
  }

  if (!planData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No lesson plan to display.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const procedureSteps = [
    { label: '1. Review previous lesson / introduce new lesson', value: planData.proc1 },
    { label: '2. State lesson purpose', value: planData.proc2 },
    { label: '3. Present examples / illustrations', value: planData.proc3 },
    { label: '4. Discuss and practice concepts/skills', value: planData.proc4 },
    { label: '5. Develop mastery', value: planData.proc5 },
    { label: '6. Apply concepts in real life', value: planData.proc6 },
    { label: '7. Make generalizations / abstractions', value: planData.proc7 },
    { label: '8. Evaluate learning', value: planData.proc8 },
    { label: '9. Additional activities for application/remediation', value: planData.proc9 },
  ];

  const handleCopyToClipboard = async () => {
    const lessonPlanText = `
      Generated Lesson Plan

      Header Information
      School: ${planData.school || 'N/A'}
      Teacher: ${planData.teacher || 'N/A'}
      Grade Level: ${planData.grade || planData.gradeLevel || 'N/A'}
      Subject: ${planData.subject || 'N/A'}
      Quarter: ${planData.quarter || 'N/A'}
      Week: ${planData.week || 'N/A'}
      Day: ${planData.day || 'N/A'}
      Date: ${planData.date || 'N/A'}

      I. Objectives
      ${planData.learningCompetencies || 'N/A'}

      II. Content
      Topic / Lesson Title: ${planData.topic || 'N/A'}
      Reference materials: ${planData.referenceMaterials || 'N/A'}

      III. Learning Resources
      ${planData.learningResources || 'N/A'}

      IV. Procedures
      ${procedureSteps.map(step => `${step.label}\n${step.value || 'N/A'}`).join('\n\n')}

      V. Remarks
      ${planData.remarks || 'N/A'}

      VI. Reflection
      ${planData.reflection || 'N/A'}
    `;

    await Clipboard.setStringAsync(lessonPlanText);
    Alert.alert('Copied!', 'The lesson plan has been copied to the clipboard.');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button title="Go Back" onPress={() => router.back()} />
        <Button title="Copy to Clipboard" onPress={handleCopyToClipboard} />
        <ThemedText type="title" style={styles.header}>Generated Lesson Plan</ThemedText>

        <Collapsible title="Header Information">
          <Text><Text style={styles.bold}>School:</Text> {planData.school || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Teacher:</Text> {planData.teacher || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Grade Level:</Text> {planData.grade || planData.gradeLevel || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Subject:</Text> {planData.subject || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Quarter:</Text> {planData.quarter || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Week:</Text> {planData.week || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Day:</Text> {planData.day || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Date:</Text> {planData.date || 'N/A'}</Text>
        </Collapsible>

        <Collapsible title="I. Objectives">
          <Text>{planData.learningCompetencies || 'N/A'}</Text>
        </Collapsible>

        <Collapsible title="II. Content">
          <Text><Text style={styles.bold}>Topic / Lesson Title:</Text> {planData.topic || 'N/A'}</Text>
          <Text><Text style={styles.bold}>Reference materials:</Text> {planData.referenceMaterials || 'N/A'}</Text>
        </Collapsible>

        <Collapsible title="III. Learning Resources">
          <Text>{planData.learningResources || 'N/A'}</Text>
        </Collapsible>

        <Collapsible title="IV. Procedures">
          {procedureSteps.map((step, index) => (
            <View key={index} style={styles.procedureStep}>
              <Text style={styles.bold}>{step.label}</Text>
              <Text>{step.value || 'N/A'}</Text>
            </View>
          ))}
        </Collapsible>

        <Collapsible title="V. Remarks">
          <Text>{planData.remarks || 'N/A'}</Text>
        </Collapsible>

        <Collapsible title="VI. Reflection">
          <Text>{planData.reflection || 'N/A'}</Text>
        </Collapsible>

        <Button title="Go Back" onPress={() => router.back()} />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20, // Padding moved to scrollContent
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Add some extra padding at the bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  procedureStep: {
    marginBottom: 10,
  }
});

export default PlanScreen;
