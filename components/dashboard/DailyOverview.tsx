import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card'; // Assuming default export

export const DailyOverview = () => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Daily Overview</Text>
      {/* Add content here - e.g., summary of goals/habits for the day */}
      <Text>Your progress today...</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add specific styles if needed
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

// export default DailyOverview; // Decide if default export is needed
