import React, { useState } from 'react';
import { View, StyleSheet, FlatList, LayoutAnimation } from 'react-native';
import { Card, Text, ProgressBar, IconButton, Button, TextInput, Divider, Menu, useTheme, MD3Theme } from 'react-native-paper';
import { Goal, GoalTask } from '../../models/Goal';
import { TaskItem } from './TaskItem';

interface GoalCardProps {
  goal: Goal;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goal: Goal) => void;
  onAddTask: (goalId: string, taskName: string, taskXp?: number) => void;
  onToggleTask: (goalId: string, taskId: string) => void;
  onEditTask: (goalId: string, task: GoalTask) => void;
  onDeleteTask: (goalId: string, taskId: string) => void;
}

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    flexShrink: 1, // Prevent title from pushing icons off
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  xpText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontStyle: 'italic',
      marginLeft: 8,
  },
  progressBar: {
    marginTop: 8,
    marginBottom: 8,
    height: 8,
    borderRadius: 4,
  },
  taskSection: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: theme.colors.onSurfaceVariant,
  },
  noTasks: {
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: 10,
  },
  addTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  taskInput: {
    flex: 1,
    marginRight: 8,
    backgroundColor: theme.colors.surface, // Background for input
  },
  addTaskBtn: {
    // Button styling is handled by the component itself
  },
  goalActionsContainer: {
    flexDirection: 'row',
  },
  collapsibleContent: {
    // paddingBottom: 8, // Add padding if needed
  },
  goalMenuAnchor: {
    // Style anchor if needed, often IconButton is fine
  }
});

export const GoalCard = ({
  goal,
  onEditGoal,
  onDeleteGoal,
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: GoalCardProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [taskInput, setTaskInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleAddTaskPress = () => {
    if (taskInput.trim()) {
      onAddTask(goal.id, taskInput.trim());
      setTaskInput('');
    }
  };

  const toggleExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate layout change
    setIsExpanded(!isExpanded);
  }

  const progress = (goal.progress ?? 0) / 100;

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Title
        title={<Text style={styles.goalTitle}>{goal.name}</Text>}
        subtitle={
            <View>
                <Text style={styles.progressText}>Progress: {goal.progress ?? 0}%</Text>
                {goal.xpValue ? <Text style={styles.xpText}>(+{goal.xpValue} XP on completion)</Text> : null}
            </View>
        }
        left={(props) => <IconButton {...props} icon={isExpanded ? "chevron-down" : "chevron-right"} onPress={toggleExpansion} />}
        right={(props) => (
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={<IconButton {...props} icon="dots-vertical" onPress={openMenu} style={styles.goalMenuAnchor} />}
            >
              <Menu.Item onPress={() => { onEditGoal(goal); closeMenu(); }} title="Edit Goal" leadingIcon="pencil" />
              <Menu.Item onPress={() => { onDeleteGoal(goal); closeMenu(); }} title="Delete Goal" titleStyle={{ color: theme.colors.error }} leadingIcon="delete" />
            </Menu>
        )}
        style={styles.cardTitleContainer}
      />
      <Card.Content>
         <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
        {isExpanded && (
            <View style={styles.collapsibleContent}>
                <View style={styles.taskSection}>
                    <Text style={styles.taskTitle}>Tasks</Text>
                    {goal.tasks && goal.tasks.length > 0 ? (
                        <FlatList
                            data={goal.tasks}
                            renderItem={({ item: task }) => (
                            <TaskItem
                                task={task}
                                onToggle={() => onToggleTask(goal.id, task.id)}
                                onEdit={() => onEditTask(goal.id, task)}
                                onDelete={() => onDeleteTask(goal.id, task.id)}
                                theme={theme}
                            />
                            )}
                            keyExtractor={task => task.id}
                            ItemSeparatorComponent={() => <Divider style={{ marginVertical: 4}}/>}
                            scrollEnabled={false} // Prevent nested scrolling issues
                        />
                    ) : (
                        <Text style={styles.noTasks}>No tasks added yet.</Text>
                    )}
                    {/* Add Task Input */}
                    <View style={styles.addTaskRow}>
                        <TextInput
                            label="New Task Name"
                            value={taskInput}
                            onChangeText={setTaskInput}
                            mode="outlined"
                            style={styles.taskInput}
                            dense // Make input smaller
                        />
                        <Button
                            mode="contained"
                            onPress={handleAddTaskPress}
                            disabled={!taskInput.trim()}
                            icon="plus"
                            style={styles.addTaskBtn}
                            compact // Make button smaller
                        >
                            Add
                        </Button>
                    </View>
                </View>
            </View>
        )}
      </Card.Content>
      {/* Removed Card.Actions as goal actions are in the menu */}
    </Card>
  );
}; 