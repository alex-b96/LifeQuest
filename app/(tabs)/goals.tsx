import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, Button, FAB, Portal, Dialog, TextInput, useTheme, MD3Theme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Goal, GoalTask } from '../../models/Goal';
import { useAppContext } from '../../contexts/AppContext';
import { GoalCard } from '../../components/goals/GoalCard';

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  picker: {
  },
  textInput: {
    marginBottom: 16,
  },
  dialog: {
    borderRadius: 8,
  },
  dialogTitle: {
  },
  dialogContent: {
    paddingBottom: 0,
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  deleteDialogText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 24,
  },
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
    updateGoalTask,
  } = useAppContext();

  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showEditGoalDialog, setShowEditGoalDialog] = useState(false);
  const [showDeleteGoalDialog, setShowDeleteGoalDialog] = useState(false);
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTraitId, setNewGoalTraitId] = useState<string | undefined>(undefined);
  const [newGoalXpValue, setNewGoalXpValue] = useState<string>('50');

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalTraitId, setEditGoalTraitId] = useState<string | undefined>(undefined);
  const [editGoalXpValue, setEditGoalXpValue] = useState<string>('');

  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  const [editingTaskInfo, setEditingTaskInfo] = useState<{goalId: string, task: GoalTask} | null>(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskXpValue, setEditTaskXpValue] = useState<string>('10');

  const [deletingTaskInfo, setDeletingTaskInfo] = useState<{goalId: string, taskId: string, taskName: string} | null>(null);

  const openAddGoalDialog = () => {
    setNewGoalName('');
    setNewGoalTraitId(traits.length > 0 ? traits[0].id : undefined);
    setNewGoalXpValue('50');
    setShowAddGoalDialog(true);
  };
  const closeAddGoalDialog = () => setShowAddGoalDialog(false);

  const openEditGoalDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setEditGoalName(goal.name);
    setEditGoalTraitId(goal.traitId);
    setEditGoalXpValue(goal.xpValue?.toString() ?? '');
    setShowEditGoalDialog(true);
  };
  const closeEditGoalDialog = () => {
    setShowEditGoalDialog(false);
    setEditingGoal(null);
  };

  const openDeleteGoalDialog = (goal: Goal) => {
    setDeletingGoal(goal);
    setShowDeleteGoalDialog(true);
  };
  const closeDeleteGoalDialog = () => {
    setShowDeleteGoalDialog(false);
    setDeletingGoal(null);
  };

  const openEditTaskDialog = (goalId: string, task: GoalTask) => {
    setEditingTaskInfo({ goalId, task });
    setEditTaskName(task.name);
    setEditTaskXpValue(task.xpValue?.toString() ?? '10');
    setShowEditTaskDialog(true);
  };
  const closeEditTaskDialog = () => {
    setShowEditTaskDialog(false);
    setEditingTaskInfo(null);
  };

  const openDeleteTaskDialog = (goalId: string, taskId: string) => {
    const goal = goals.find(g => g.id === goalId);
    const task = goal?.tasks.find(t => t.id === taskId);
    if (task) {
      setDeletingTaskInfo({ goalId, taskId, taskName: task.name });
      setShowDeleteTaskDialog(true);
    }
  };
  const closeDeleteTaskDialog = () => {
    setShowDeleteTaskDialog(false);
    setDeletingTaskInfo(null);
  };

  async function handleAddGoal() {
    if (!newGoalName.trim()) return;
    const xpValue = parseInt(newGoalXpValue, 10);
    const finalXpValue = !isNaN(xpValue) && newGoalXpValue.trim() !== '' ? xpValue : undefined;

    await addGoal({
      name: newGoalName.trim(),
      status: 'active',
      traitId: newGoalTraitId,
      xpValue: finalXpValue,
    });
    closeAddGoalDialog();
  }

  async function handleEditGoalSave() {
    if (!editingGoal || !editGoalName.trim()) return;
    const xpValue = parseInt(editGoalXpValue, 10);
    const finalXpValue = !isNaN(xpValue) && editGoalXpValue.trim() !== '' ? xpValue : undefined;

    await updateGoal({
      ...editingGoal,
      name: editGoalName.trim(),
      traitId: editGoalTraitId,
      xpValue: finalXpValue,
    });
    closeEditGoalDialog();
  }

  async function handleDeleteGoalConfirm() {
    if (deletingGoal) {
      await deleteGoal(deletingGoal.id);
      closeDeleteGoalDialog();
    }
  }

  async function handleAddTask(goalId: string, taskName: string) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !taskName.trim()) return;

    const newTask: GoalTask = {
      id: Date.now().toString(),
      name: taskName.trim(),
      completed: false,
      xpValue: 10,
    };

    const updatedTasks = [...goal.tasks, newTask];
    const total = updatedTasks.length;
    const done = updatedTasks.filter(t => t.completed).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    await updateGoal({ ...goal, tasks: updatedTasks, progress });
  }

  async function handleToggleTask(goalId: string, taskId: string) {
    // Find the goal and task to determine the new completed status
    const goal = goals.find(g => g.id === goalId);
    const task = goal?.tasks.find(t => t.id === taskId);

    // If goal and task exist, call updateGoalTask with the toggled status
    if (goal && task) {
      await updateGoalTask(goalId, taskId, !task.completed);
    } else {
        console.warn("Could not find goal or task to toggle"); // Optional: Add a warning if not found
    }
  }

  async function handleEditTaskSave() {
    if (!editingTaskInfo || !editTaskName.trim()) return;

    const { goalId, task } = editingTaskInfo;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const xpValue = parseInt(editTaskXpValue, 10);
    const finalTaskXpValue = !isNaN(xpValue) && editTaskXpValue.trim() !== '' ? xpValue : undefined;

    const updatedTasks = goal.tasks.map(t =>
      t.id === task.id ? { ...t, name: editTaskName.trim(), xpValue: finalTaskXpValue } : t
    );

    await updateGoal({ ...goal, tasks: updatedTasks });

    closeEditTaskDialog();
  }

  async function handleDeleteTaskConfirm() {
    if (!deletingTaskInfo) return;
    const { goalId, taskId } = deletingTaskInfo;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedTasks = goal.tasks.filter(t => t.id !== taskId);
    const total = updatedTasks.length;
    const done = updatedTasks.filter(t => t.completed).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    await updateGoal({ ...goal, tasks: updatedTasks, progress });

    closeDeleteTaskDialog();
  }

  const renderItem = ({ item }: { item: Goal }) => (
    <GoalCard
      goal={item}
      onEditGoal={openEditGoalDialog}
      onDeleteGoal={openDeleteGoalDialog}
      onAddTask={handleAddTask}
      onToggleTask={handleToggleTask}
      onEditTask={openEditTaskDialog}
      onDeleteTask={openDeleteTaskDialog}
    />
  );

  return (
    <View style={styles.container}>
      {goals.length === 0 ? (
        <View style={styles.emptyState}>
          <Image source={require('../../assets/images/logo.png')} style={styles.emptyImage} resizeMode="contain" />
          <Text style={styles.emptyText}>No goals defined yet. Let's set some targets!</Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Portal>
        <Dialog visible={showAddGoalDialog} onDismiss={closeAddGoalDialog} style={styles.dialog}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <Dialog.Title style={styles.dialogTitle}>Add New Goal</Dialog.Title>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Content style={styles.dialogContent}>
                <TextInput label="Goal Name" value={newGoalName} onChangeText={setNewGoalName} mode="outlined" style={styles.textInput}/>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={newGoalTraitId} onValueChange={(itemValue) => setNewGoalTraitId(itemValue || undefined)} style={styles.picker} prompt="Link to Trait (Optional)">
                    <Picker.Item label="No Linked Trait" value={undefined} />
                    {traits.map((trait) => (<Picker.Item key={trait.id} label={trait.name} value={trait.id} />))}
                  </Picker>
                </View>
                <TextInput label="Completion XP (Optional)" value={newGoalXpValue} onChangeText={setNewGoalXpValue} mode="outlined" style={styles.textInput} keyboardType="numeric"/>
              </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={closeAddGoalDialog}>Cancel</Button>
              <Button onPress={handleAddGoal} disabled={!newGoalName.trim()} mode="contained">Add Goal</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={showEditGoalDialog} onDismiss={closeEditGoalDialog} style={styles.dialog}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <Dialog.Title style={styles.dialogTitle}>Edit Goal</Dialog.Title>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Content style={styles.dialogContent}>
                <TextInput label="Goal Name" value={editGoalName} onChangeText={setEditGoalName} mode="outlined" style={styles.textInput}/>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={editGoalTraitId} onValueChange={(itemValue) => setEditGoalTraitId(itemValue || undefined)} style={styles.picker} prompt="Link to Trait (Optional)">
                    <Picker.Item label="No Linked Trait" value={undefined} />
                    {traits.map((trait) => (<Picker.Item key={trait.id} label={trait.name} value={trait.id} />))}
                  </Picker>
                </View>
                <TextInput label="Completion XP (Optional)" value={editGoalXpValue} onChangeText={setEditGoalXpValue} mode="outlined" style={styles.textInput} keyboardType="numeric"/>
              </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={closeEditGoalDialog}>Cancel</Button>
              <Button onPress={handleEditGoalSave} disabled={!editGoalName.trim()} mode="contained">Save Changes</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={showDeleteGoalDialog} onDismiss={closeDeleteGoalDialog} style={styles.dialog}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.deleteDialogText}>Are you sure you want to delete the goal "{deletingGoal?.name}"? All associated tasks will also be deleted. This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDeleteGoalDialog}>Cancel</Button>
            <Button onPress={handleDeleteGoalConfirm} textColor={theme.colors.error}>Delete Goal</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showEditTaskDialog} onDismiss={closeEditTaskDialog} style={styles.dialog}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <Dialog.Title style={styles.dialogTitle}>Edit Task</Dialog.Title>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Content style={styles.dialogContent}>
                <TextInput label="Task Name" value={editTaskName} onChangeText={setEditTaskName} mode="outlined" style={styles.textInput}/>
                <TextInput label="Task XP (Optional)" value={editTaskXpValue} onChangeText={setEditTaskXpValue} mode="outlined" style={styles.textInput} keyboardType="numeric"/>
              </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={closeEditTaskDialog}>Cancel</Button>
              <Button onPress={handleEditTaskSave} disabled={!editTaskName.trim()} mode="contained">Save Task</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={showDeleteTaskDialog} onDismiss={closeDeleteTaskDialog} style={styles.dialog}>
          <Dialog.Title>Confirm Task Deletion</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.deleteDialogText}>Are you sure you want to delete the task "{deletingTaskInfo?.taskName}"? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDeleteTaskDialog}>Cancel</Button>
            <Button onPress={handleDeleteTaskConfirm} textColor={theme.colors.error}>Delete Task</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={openAddGoalDialog}
        color={theme.colors.onPrimary}
        label="Add Goal"
        accessibilityLabel="Add New Goal"
      />
    </View>
  );
}
