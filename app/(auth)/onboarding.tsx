import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import Button from '../../components/common/Button';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleComplete = () => {
    // Save onboarding state
    // Navigate to the main app (e.g., dashboard)
    router.replace('/dashboard'); // Or wherever your main app starts
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LifeQuest!</Text>
      <Text style={styles.description}>
        Get ready to track your personal growth.
      </Text>
      {/* Add onboarding steps/content here */}
      {/* <Button title="Get Started" onPress={handleComplete} /> */}
       <Text onPress={handleComplete} style={{color: 'blue', marginTop: 20}}>Get Started (Temporary Link)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
});
