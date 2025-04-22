import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, IconButton, useTheme, MD3Theme } from 'react-native-paper';
import { Trait } from '../../models/Trait'; // Correctly import the Trait type

interface TraitCardProps {
  trait: Trait;
  onEdit: (trait: Trait) => void;
  onDelete: (trait: Trait) => void;
}

// Function to create styles based on the theme
const getStyles = (theme: MD3Theme) => StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8, // Consistent corner radius
  },
  progressBar: {
    marginTop: 8,
    height: 6, // Slightly thinner progress bar
    borderRadius: 3,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant, // Use theme color
    marginTop: 4,
    fontStyle: 'italic',
  },
  levelText: {
    fontWeight: 'bold',
    color: theme.colors.primary, // Use primary theme color for level
  },
  xpText: {
    color: theme.colors.secondary, // Use secondary theme color for XP
  },
  actionsContainer: {
      justifyContent: 'flex-end', // Align buttons to the right
  }
});

export const TraitCard = ({ trait, onEdit, onDelete }: TraitCardProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const progress = (trait.experiencePoints % 100) / 100;

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Title
        title={trait.name}
        subtitle={trait.description || 'No description'}
        titleStyle={{ fontWeight: 'bold' }} // Bold title
      />
      <Card.Content>
        <Text>Level: <Text style={styles.levelText}>{trait.level}</Text></Text>
        <Text>Experience: <Text style={styles.xpText}>{trait.experiencePoints}</Text></Text>
        <ProgressBar progress={progress} style={styles.progressBar} color={theme.colors.primary} />
        <Text style={styles.lastUpdatedText}>
          Last Updated: {new Date(trait.lastUpdated).toLocaleDateString()}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.actionsContainer}>
        <IconButton icon="pencil" onPress={() => onEdit(trait)} accessibilityLabel="Edit Trait" />
        <IconButton icon="delete" onPress={() => onDelete(trait)} accessibilityLabel="Delete Trait" iconColor={theme.colors.error} />
      </Card.Actions>
    </Card>
  );
};

// No need for default export if named export is used consistently
// export default TraitCard;
