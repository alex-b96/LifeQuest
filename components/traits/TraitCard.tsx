import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card'; // Assuming default export
// import { Trait } from '../../models/Trait';

interface TraitCardProps {
  trait: any; // Replace 'any' with 'Trait'
}

export const TraitCard = ({ trait }: TraitCardProps) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.name}>{trait?.name || 'Trait Name'}</Text>
      <Text style={styles.description}>{trait?.description || 'Description...'}</Text>
      <Text style={styles.level}>Level: {trait?.level || '?'}</Text>
      {/* Add progress indicators or actions */}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  level: {
    fontSize: 14,
    fontWeight: '600',
  },
});

// export default TraitCard; // Decide if default export is needed
