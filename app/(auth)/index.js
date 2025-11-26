import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#FDECC8', '#A2D5F2']} 
      style={styles.gradientContainer}
      start={{ x: 1, y: 0.5 }} // Start from the right
      end={{ x: 0, y: 0.5 }}   // End at the left
    >
      <ThemedView style={styles.container}>
        {/* Icon */}
        <Image
          source={require('@/assets/images/Group 1.png')}
          style={styles.iconImage}
        />

        {/* Title */}
        <ThemedText type="title" style={styles.title}>EduPlanAI</ThemedText>

        {/* Illustration */}
        <Image
          source={require('@/assets/images/illustration.png')}
          style={styles.illustration}
        />

        {/* Subtitle */}
        <ThemedText style={styles.subtitle}>Smart Lesson Planning, Simplified by AI</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>Create professional lesson plans in minutes with AI</ThemedText>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.loginButton}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </Link>
          <Link href="/(auth)/register" asChild>
            <Pressable style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Sign up</Text>
            </Pressable>
          </Link>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Powered by AI Made for Teachers</ThemedText>
        </View>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    // This container's only job is to be the gradient background.
    // All alignment and padding is handled by the inner 'container' style.
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Move padding here
    backgroundColor: 'transparent', // Make this transparent to see the gradient
  },
  iconImage: {
    width: 93,
    height: 75,
    // borderRadius: 40, // Removed to prevent clipping the image corners
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  illustration: {
    width: 200,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white', // Original background color for signup button
  },
  signupButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});
