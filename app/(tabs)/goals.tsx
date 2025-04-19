import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Button, Card, IconButton, FAB, Portal, Dialog, TextInput, ProgressBar, useTheme, Checkbox, MD3Theme } from 'react-native-paper';
import { goalService } from '../../services/goalService';
import { Goal, GoalTask } from '../../models/Goal';

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  progressBar: {
    marginTop: 8,
    marginBottom: 16,
    height: 8,
    borderRadius: 4,
  },
  taskSection: {
    marginTop: 8,
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
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.onSurfaceDisabled,
  },
  addTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  taskInput: {
    flex: 1,
    marginRight: 8,
  },
  addTaskBtn: {
    height: 40,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default function GoalsScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [editTaskInput, setEditTaskInput] = useState('');
  const [editTask, setEditTask] = useState<{goalId: string, task: GoalTask} | null>(null);
  const [deleteTask, setDeleteTask] = useState<{goalId: string, taskId: string} | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    setLoading(true);
    const data = await goalService.getGoals();
    setGoals(data);
    setLoading(false);
  }

  async function handleAddGoal() {
    if (!newGoal.trim()) return;
    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
      progress: 0,
      tasks: [],
    };
    await goalService.addGoal(goal);
    setNewGoal('');
    setShowAdd(false);
    loadGoals();
  }

  async function handleEditGoalSave() {
    if (editGoal && editName.trim()) {
      await goalService.updateGoal({ ...editGoal, name: editName.trim() });
      setEditGoal(null);
      setEditName('');
      loadGoals();
    }
  }

  async function handleDeleteGoal() {
    if (deleteGoalId) {
      await goalService.deleteGoal(deleteGoalId);
      setDeleteGoalId(null);
      loadGoals();
    }
  }

  async function handleAddTask(goal: Goal) {
    if (!taskInput.trim()) return;
    const newTask: GoalTask = {
      id: Date.now().toString(),
      name: taskInput.trim(),
      completed: false,
    };
    const updatedGoal = { ...goal, tasks: [...goal.tasks, newTask] };
    const total = updatedGoal.tasks.length;
    const done = updatedGoal.tasks.filter(t => t.completed).length;
    updatedGoal.progress = total > 0 ? Math.round((done / total) * 100) : 0;
    await goalService.updateGoal(updatedGoal);
    setTaskInput('');
    loadGoals();
  }

  async function handleToggleTask(goal: Goal, task: GoalTask) {
    await goalService.toggleTask(goal.id, task.id);
    loadGoals();
  }

  const renderGoal = ({ item }: { item: Goal }) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]} > 
      <Card.Title
        title={<Text style={styles.goalTitle}>{item.name}</Text>}
        subtitle={<Text style={styles.progressText}>{item.progress}% complete</Text>}
        right={(props) => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => {
                setEditGoal(item);
                setEditName(item.name);
              }}
              accessibilityLabel="Edit Goal"
            />
            <IconButton
              {...props}
              icon="delete"
              onPress={() => setDeleteGoalId(item.id)}
              accessibilityLabel="Delete Goal"
            />
          </View>
        )}
      />
      <Card.Content>
        <ProgressBar progress={item.progress / 100} color={theme.colors.primary} style={styles.progressBar} />
        <View style={styles.taskSection}>
          <Text style={styles.taskTitle}>Tasks:</Text>
          {item.tasks.length === 0 && <Text style={styles.noTasks}>No tasks yet.</Text>}
          {item.tasks.map(task => (
            <View key={task.id} style={styles.taskRow}>
              <Checkbox
                status={task.completed ? 'checked' : 'unchecked'}
                onPress={() => handleToggleTask(item, task)}
                color={theme.colors.primary}
              />
              <Text style={[styles.taskText, task.completed && styles.taskCompleted]}>{task.name}</Text>
              <IconButton
                icon="pencil"
                size={18}
                onPress={() => {
                  setEditTask({ goalId: item.id, task });
                  setEditTaskInput(task.name);
                }}
                style={{ marginLeft: 0 }}
                accessibilityLabel="Edit Task"
              />
              <IconButton
                icon="delete"
                size={18}
                onPress={() => setDeleteTask({ goalId: item.id, taskId: task.id })}
                style={{ marginLeft: 0 }}
                accessibilityLabel="Delete Task"
              />
            </View>
          ))}
          <View style={styles.addTaskRow}>
            <TextInput
              mode="outlined"
              placeholder="Add task"
              value={item.id === editGoal?.id ? editTaskInput : taskInput}
              onChangeText={text => item.id === editGoal?.id ? setEditTaskInput(text) : setTaskInput(text)}
              style={styles.taskInput}
              dense
            />
            <Button
              mode="contained"
              onPress={() => handleAddTask(item)}
              style={styles.addTaskBtn}
              compact
            >
              Add
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Goals</Text>
      {goals.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No goals yet. Set your first goal!</Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
          refreshing={loading}
          onRefresh={loadGoals}
        />
      )}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setShowAdd(true)}
        label="Add Goal"
        color={theme.colors.onPrimary}
      />
      <Portal>
        {/* Edit Task Dialog */}
        <Dialog visible={!!editTask} onDismiss={() => setEditTask(null)}>
          <Dialog.Title>Edit Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Task Name"
              value={editTaskInput}
              onChangeText={setEditTaskInput}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditTask(null)}>Cancel</Button>
            <Button
              onPress={async () => {
                if (editTask && editTaskInput.trim()) {
                  await goalService.editTask(editTask.goalId, editTask.task.id, editTaskInput.trim());
                  setEditTask(null);
                  setEditTaskInput('');
                  loadGoals();
                }
              }}
            >Save</Button>
          </Dialog.Actions>
        </Dialog>
        {/* Delete Task Dialog */}
        <Dialog visible={!!deleteTask} onDismiss={() => setDeleteTask(null)}>
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this task?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTask(null)}>Cancel</Button>
            <Button
              onPress={async () => {
                if (deleteTask) {
                  await goalService.deleteTask(deleteTask.goalId, deleteTask.taskId);
                  setDeleteTask(null);
                  loadGoals();
                }
              }}
              color={theme.colors.error}
            >Delete</Button>
          </Dialog.Actions>
        </Dialog>
        {/* Add Dialog */}
        <Dialog visible={showAdd} onDismiss={() => setShowAdd(false)}>
          <Dialog.Title>Add New Goal</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Goal Name"
              value={newGoal}
              onChangeText={setNewGoal}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button onPress={handleAddGoal}>Add</Button>
          </Dialog.Actions>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog visible={!!editGoal} onDismiss={() => setEditGoal(null)}>
          <Dialog.Title>Edit Goal</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Goal Name"
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditGoal(null)}>Cancel</Button>
            <Button onPress={handleEditGoalSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>
        {/* Delete Confirm Dialog */}
        <Dialog visible={!!deleteGoalId} onDismiss={() => setDeleteGoalId(null)}>
          <Dialog.Title>Delete Goal</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this goal?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteGoalId(null)}>Cancel</Button>
            <Button onPress={handleDeleteGoal} color="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
