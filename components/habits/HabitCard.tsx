import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, IconButton, Avatar, useTheme, MD3Theme } from 'react-native-paper';
import { Habit } from '../../models/Habit';

interface HabitCardProps {
  habit: Habit;
  completedToday: boolean;
  onCheckIn: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Keep title and icons apart
    paddingRight: 0, // Adjust as Card.Title has its own padding
  },
  titleContent: {
     flex: 1, // Allow title content to take available space
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 8,
    color: theme.colors.onSurface,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // Add some space below title
  },
  streakIcon: {
    backgroundColor: theme.colors.primary,
    marginRight: 6,
  },
  streakText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  xpText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row', // Arrange edit/delete horizontally
  },
  checkInButton: {
    borderRadius: 20, // Rounded button
    marginRight: 8, // Space between check-in and other actions if needed
  },
  checkInLabelCompleted: {
      // Style for completed state (already handled by mode='contained')
  },
  checkInLabelDefault: {
      color: theme.colors.primary, // Color for 'outlined' mode
  },
  cardActions: {
      justifyContent: 'space-between', // Space out check-in and edit/delete
      paddingHorizontal: 16, // Standard padding for actions
      paddingBottom: 12,
  }
});

export const HabitCard = ({ habit, completedToday, onCheckIn, onEdit, onDelete }: HabitCardProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]} elevation={1}>
      {/* Use Card.Title for better structure, passing custom elements */}
      <Card.Title
        title={
          <View style={styles.titleContent}>
            <Text style={styles.habitTitle} numberOfLines={1} ellipsizeMode="tail">{habit.name}</Text>
             <View style={styles.subtitleContainer}>
              <Avatar.Icon size={20} icon="fire" color={theme.colors.onPrimary} style={styles.streakIcon} />
              <Text style={styles.streakText}>{habit.streak ?? 0} day streak</Text>
              {habit.xpValue ? <Text style={styles.xpText}>(+{habit.xpValue} XP)</Text> : null}
            </View>
          </View>
        }
        // Removed subtitle prop as it's integrated into the title element
        right={(props) => (
          <View style={styles.actionsContainer}>
            <IconButton
              {...props}
              icon="pencil"
              size={20}
              onPress={() => onEdit(habit)}
              accessibilityLabel="Edit Habit"
            />
            <IconButton
              {...props}
              icon="delete"
              size={20}
              onPress={() => onDelete(habit)}
              accessibilityLabel="Delete Habit"
              iconColor={theme.colors.error}
            />
          </View>
        )}
        style={styles.cardTitleContainer} // Apply style to Card.Title container
      />
      {/* Card.Actions are used for main interaction buttons */}
      <Card.Actions style={styles.cardActions}>
        <Button
          mode={completedToday ? 'contained' : 'outlined'}
          onPress={() => onCheckIn(habit)}
          icon={'check'}
          style={styles.checkInButton}
          labelStyle={!completedToday ? styles.checkInLabelDefault : styles.checkInLabelCompleted}
        >
          {completedToday ? 'Completed Today' : 'Check In'}
        </Button>
         {/* Placeholder View to push check-in button left if needed, or adjust justifyContent */}
         {/* <View/> */}
      </Card.Actions>
    </Card>
  );
}; 