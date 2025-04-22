import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Card, IconButton, FAB, Portal, Dialog, TextInput, ProgressBar, useTheme, MD3Theme, Checkbox, Menu, Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Goal, GoalTask } from '../../models/Goal';
import { useAppContext } from '../../contexts/AppContext';

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  picker: {
    // Height adjustments might be needed depending on platform
  },
  textInput: {
    // Add this style for text input
  }
});

export default function GoalsScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { 
    goals, 
    traits, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    updateGoalTask 
  } = useAppContext();

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTraitId, setNewGoalTraitId] = useState<string | undefined>(undefined);
  const [newGoalXpValue, setNewGoalXpValue] = useState<string>('10');

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalTraitId, setEditGoalTraitId] = useState<string | undefined>(undefined);
  const [editGoalXpValue, setEditGoalXpValue] = useState<string>('');

  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState<{ [key: string]: string }>({});
  const [editTask, setEditTask] = useState<{goalId: string, task: GoalTask} | null>(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskXpValue, setEditTaskXpValue] = useState('');
  const [deleteTask, setDeleteTask] = useState<{goalId: string, taskId: string} | null>(null);

  async function handleAddGoal() {
    if (!newGoalName.trim()) return;
    const xpValue = parseInt(newGoalXpValue, 10);
    const finalXpValue = !isNaN(xpValue) && newGoalXpValue.trim() !== '' ? xpValue : undefined;

    await addGoal({
      name: newGoalName.trim(),
      status: 'active', // Added missing status property for type compatibility
      traitId: newGoalTraitId, // Add traitId
      xpValue: finalXpValue // Add parsed xpValue
    });
    setNewGoalName('');
    setNewGoalTraitId(undefined);
    setNewGoalXpValue('10');
    setShowAddGoal(false);
  }

  async function handleEditGoalSave() {
    if (!editingGoal || !editGoalName.trim()) return;
    const xpValue = parseInt(editGoalXpValue, 10);
    const finalXpValue = !isNaN(xpValue) && editGoalXpValue.trim() !== '' ? xpValue : undefined;

    await updateGoal({ 
        ...editingGoal, 
        name: editGoalName.trim(),
        traitId: editGoalTraitId,
        xpValue: finalXpValue
    });
    setEditingGoal(null);
    setEditGoalName('');
    setEditGoalTraitId(undefined);
    setEditGoalXpValue('');
  }

  async function handleDeleteGoal() {
    if (deleteGoalId) {
      await deleteGoal(deleteGoalId);
      setDeleteGoalId(null);
    }
  }

  async function handleAddTask(goalId: string) {
    const currentInput = taskInput[goalId] || '';
    if (!currentInput.trim()) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newTask: GoalTask = {
      id: Date.now().toString(), 
      name: currentInput.trim(),
      completed: false,
      xpValue: 10
    };
    
    const updatedGoal = { ...goal, tasks: [...goal.tasks, newTask] };
    const total = updatedGoal.tasks.length;
    const done = updatedGoal.tasks.filter(t => t.completed).length;
    updatedGoal.progress = total > 0 ? Math.round((done / total) * 100) : 0;

    await updateGoal(updatedGoal); 
    setTaskInput({ ...taskInput, [goalId]: '' }); 
  }

  async function handleToggleTask(goalId: string, taskId: string) {
    const goal = goals.find(g => g.id === goalId);
    const task = goal?.tasks.find(t => t.id === taskId);
    if (!goal || !task) return;
    await updateGoalTask(goalId, taskId, !task.completed);
  }

  function handleEditTask(goalId: string, task: GoalTask) {
    setEditTask({ goalId, task });
    setEditTaskName(task.name);
    setEditTaskXpValue(task.xpValue?.toString() ?? '');
  }

  async function handleEditTaskSave() {
    if (!editTask || !editTaskName.trim()) return;

    const { goalId, task } = editTask;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const xpValue = parseInt(editTaskXpValue, 10);
    const finalXpValue = !isNaN(xpValue) && editTaskXpValue.trim() !== '' ? xpValue : undefined;

    const updatedTasks = goal.tasks.map(t => 
      t.id === task.id ? { 
        ...t, 
        name: editTaskName.trim(),
        xpValue: finalXpValue
      } : t
    );
    const updatedGoal = { ...goal, tasks: updatedTasks };

    await updateGoal(updatedGoal); 

    setEditTask(null);
    setEditTaskName('');
    setEditTaskXpValue('');
  }

  async function handleDeleteTask() {
    if (!deleteTask) return;
    const { goalId, taskId } = deleteTask;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedTasks = goal.tasks.filter(t => t.id !== taskId);
    const updatedGoal = { ...goal, tasks: updatedTasks };

    const total = updatedGoal.tasks.length;
    const done = updatedGoal.tasks.filter(t => t.completed).length;
    updatedGoal.progress = total > 0 ? Math.round((done / total) * 100) : 0;

    await updateGoal(updatedGoal); 

    setDeleteTask(null);
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
                setEditingGoal(item);
                setEditGoalName(item.name);
                setEditGoalTraitId(item.traitId);
                setEditGoalXpValue(item.xpValue?.toString() ?? '');
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
        <Text style={styles.taskTitle}>Tasks:</Text>
        {item.tasks.length === 0 ? (
          <Text style={styles.noTasks}>No tasks added yet.</Text>
        ) : (
          item.tasks.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <Checkbox
                status={task.completed ? 'checked' : 'unchecked'}
                onPress={() => handleToggleTask(item.id, task.id)} 
              />
              <Text 
                style={[styles.taskText, task.completed && styles.taskCompleted]}
                onPress={() => handleToggleTask(item.id, task.id)} 
              >
                {task.name}
                {task.xpValue ? <Text style={{fontSize: 12, color: theme.colors.primary}}> (+{task.xpValue} XP)</Text> : ''}
              </Text>
              <IconButton icon="pencil" size={20} onPress={() => handleEditTask(item.id, task)} />
              <IconButton icon="delete" size={20} onPress={() => setDeleteTask({ goalId: item.id, taskId: task.id })} />
            </View>
          ))
        )}
        <View style={styles.addTaskRow}>
          <TextInput
            label="New Task"
            value={taskInput[item.id] || ''} 
            onChangeText={(text) => setTaskInput({ ...taskInput, [item.id]: text })}
            style={styles.taskInput}
            mode="outlined"
            dense
          />
          <Button 
            mode="contained" 
            onPress={() => handleAddTask(item.id)} 
            style={styles.addTaskBtn}
            icon="plus"
            disabled={!taskInput[item.id]?.trim()} 
          >
            Add
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {goals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No goals yet. Add one!</Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }} 
        />
      )}

      <Portal>
        <Dialog visible={showAddGoal} onDismiss={() => setShowAddGoal(false)}>
          <Dialog.Title>Add New Goal</Dialog.Title>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust offset as needed
          >
            <ScrollView>
              <Dialog.Content style={{ paddingBottom: 50 }}>
                <TextInput
                  label="Goal Name"
                  value={newGoalName}
                  onChangeText={setNewGoalName}
                  mode="outlined"
                  style={styles.textInput} // Ensure this style exists or add margin
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newGoalTraitId}
                    onValueChange={(itemValue) => setNewGoalTraitId(itemValue || undefined)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Link to Trait (Completion)" value={undefined} />
                    {traits.map(trait => (
                      <Picker.Item key={trait.id} label={trait.name} value={trait.id} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  label="XP Value (Completion)"
                  value={newGoalXpValue}
                  onChangeText={setNewGoalXpValue}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.textInput} // Ensure this style exists or add margin
                />
              </Dialog.Content>
            </ScrollView>
          </KeyboardAvoidingView>
          <Dialog.Actions>
            <Button onPress={() => setShowAddGoal(false)}>Cancel</Button>
            <Button onPress={handleAddGoal}>Add</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={!!editingGoal} onDismiss={() => setEditingGoal(null)}>
          <Dialog.Title>Edit Goal</Dialog.Title>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust offset as needed
          >
            <ScrollView>
              <Dialog.Content style={{ paddingBottom: 50 }}>
                <TextInput
                  label="Goal Name"
                  value={editGoalName}
                  onChangeText={setEditGoalName}
                  mode="outlined"
                  style={styles.textInput} // Ensure this style exists or add margin
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editGoalTraitId}
                    onValueChange={(itemValue) => setEditGoalTraitId(itemValue || undefined)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Link to Trait (Completion)" value={undefined} />
                    {traits.map(trait => (
                      <Picker.Item key={trait.id} label={trait.name} value={trait.id} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  label="XP Value (Completion)"
                  value={editGoalXpValue}
                  onChangeText={setEditGoalXpValue}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.textInput} // Ensure this style exists or add margin
                />
              </Dialog.Content>
            </ScrollView>
          </KeyboardAvoidingView>
          <Dialog.Actions>
            <Button onPress={() => setEditingGoal(null)}>Cancel</Button>
            <Button onPress={handleEditGoalSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={!!deleteGoalId} onDismiss={() => setDeleteGoalId(null)}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this goal and all its tasks?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteGoalId(null)}>Cancel</Button>
            <Button onPress={handleDeleteGoal} textColor={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={!!editTask} onDismiss={() => setEditTask(null)}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flexShrink: 1 }}>
            <Dialog.Title>Edit Task</Dialog.Title>
            <ScrollView style={{ flexShrink: 1 }}>
              <Dialog.Content>
                <TextInput
                  label="Task Name"
                  value={editTaskName}
                  onChangeText={setEditTaskName}
                  mode="outlined"
                  autoFocus
                />
                <TextInput
                  label="XP Value (Optional)"
                  value={editTaskXpValue}
                  onChangeText={setEditTaskXpValue}
                  mode="outlined"
                  keyboardType="numeric"
                  style={{ marginTop: 8 }}
                />
              </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={() => setEditTask(null)}>Cancel</Button>
              <Button onPress={handleEditTaskSave} disabled={!editTaskName.trim()}>Save</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={!!deleteTask} onDismiss={() => setDeleteTask(null)}>
          <Dialog.Title>Confirm Task Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this task?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTask(null)}>Cancel</Button>
            <Button onPress={handleDeleteTask} textColor={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddGoal(true)}
        accessibilityLabel="Add New Goal"
      />
    </View>
  );
}
