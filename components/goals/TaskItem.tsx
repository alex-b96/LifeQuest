import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Text, IconButton, Menu, Divider, MD3Theme } from 'react-native-paper';
import { GoalTask } from '../../models/Goal';

interface TaskItemProps {
  task: GoalTask;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  theme: MD3Theme; // Pass theme down from GoalCard
}

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4, // Add some vertical padding
    // backgroundColor: theme.colors.background, // Or surface?
  },
  checkboxContainer: {
    // marginRight: 8, // Handled by checkbox internal padding?
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center', // Vertically center text if row height varies
  },
  taskText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.onSurfaceDisabled,
  },
  xpText: {
      fontSize: 12,
      color: theme.colors.secondary, // Use secondary color for task XP
      fontStyle: 'italic',
      marginLeft: 8,
  },
  menuAnchor: {
      // IconButton is usually fine without specific anchor styling
  }
});

export const TaskItem = ({ task, onToggle, onEdit, onDelete, theme }: TaskItemProps) => {
  const styles = getStyles(theme);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.taskRow}>
       <View style={styles.checkboxContainer}>
        <Checkbox.Android // Or Checkbox.IOS based on platform or preference
            status={task.completed ? 'checked' : 'unchecked'}
            onPress={onToggle}
            color={theme.colors.primary} // Use theme color for checkbox
        />
       </View>
       <View style={styles.taskTextContainer}>
        <Text style={[styles.taskText, task.completed && styles.taskCompleted]}>
          {task.name}
        </Text>
        {task.xpValue ? <Text style={styles.xpText}>(+{task.xpValue} XP)</Text> : null}
       </View>

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={<IconButton icon="dots-vertical" onPress={openMenu} size={20} style={styles.menuAnchor}/>}
      >
        <Menu.Item onPress={() => { onEdit(); closeMenu(); }} title="Edit Task" leadingIcon="pencil"/>
        <Divider />
        <Menu.Item onPress={() => { onDelete(); closeMenu(); }} title="Delete Task" titleStyle={{ color: theme.colors.error }} leadingIcon="delete"/>
      </Menu>
    </View>
  );
}; 