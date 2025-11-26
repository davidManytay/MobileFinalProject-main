import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function Card({ children, title, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.cardContainer,
      pressed && styles.pressed,
      style,
    ]}>
      <ThemedView style={styles.cardContent}>
        {title && <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>}
        {children}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.7,
  },
});
