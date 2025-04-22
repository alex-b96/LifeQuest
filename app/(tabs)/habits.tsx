import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Text, FAB, Portal, Dialog, TextInput, useTheme, MD3Theme, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Habit } from '../../models/Habit';
import { useAppContext } from '../../contexts/AppContext';
import { HabitCard } from '../../components/habits/HabitCard';

const todayStr = () => new Date().toISOString().split('T')[0];

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: theme.colors.background,
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
  listContent: {
    paddingBottom: 80,
    paddingTop: 8
  },
});

export default function HabitsScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { habits, traits, addHabit, updateHabit, deleteHabit, completeHabit } = useAppContext();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTraitId, setNewHabitTraitId] = useState<string | undefined>(undefined);
  const [newHabitXpValue, setNewHabitXpValue] = useState<string>('10');

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState('');
  const [editTraitId, setEditTraitId] = useState<string | undefined>(undefined);
  const [editXpValue, setEditXpValue] = useState<string>('');

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const openAddDialog = () => {
    setNewHabitName('');
    setNewHabitTraitId(traits.length > 0 ? traits[0].id : undefined);
    setNewHabitXpValue('10');
    setShowAddDialog(true);
  };
  const closeAddDialog = () => setShowAddDialog(false);

  const openEditDialog = (habit: Habit) => {
    setEditingHabit(habit);
    setEditName(habit.name);
    setEditTraitId(habit.traitId);
    setEditXpValue(habit.xpValue?.toString() ?? '');
    setShowEditDialog(true);
  };
  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditingHabit(null);
  };

  const openDeleteDialog = (habit: Habit) => {
    setDeletingHabit(habit);
    setShowDeleteDialog(true);
  };
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeletingHabit(null);
  };

  async function handleCheckIn(habit: Habit) {
    await completeHabit(habit.id, todayStr());
  }

  async function handleAddHabit() {
    if (!newHabitName.trim()) return;
    const xpValue = parseInt(newHabitXpValue, 10);
    const finalXpValue = !isNaN(xpValue) && newHabitXpValue.trim() !== '' ? xpValue : undefined;

    await addHabit({
        name: newHabitName.trim(),
        frequency: 'daily',
        traitId: newHabitTraitId,
        xpValue: finalXpValue
    });
    closeAddDialog();
  }

  async function handleEditHabitSave() {
    if (editingHabit && editName.trim()) {
      const xpValue = parseInt(editXpValue, 10);
      const finalXpValue = !isNaN(xpValue) && editXpValue.trim() !== '' ? xpValue : undefined;

      await updateHabit({
        ...editingHabit,
        name: editName.trim(),
        traitId: editTraitId,
        xpValue: finalXpValue
      });
      closeEditDialog();
    }
  }

  async function handleDeleteHabitConfirm() {
    if (deletingHabit) {
      await deleteHabit(deletingHabit.id);
      closeDeleteDialog();
    }
  }

  const renderItem = ({ item }: { item: Habit }) => {
    const completedToday = item.completions?.includes(todayStr());
    return (
      <HabitCard
        habit={item}
        completedToday={completedToday ?? false}
        onCheckIn={handleCheckIn}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />
    );
  };

  return (
    <View style={styles.container}>
      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Image source={require('../../assets/images/logo.png')} style={styles.emptyImage} resizeMode="contain" />
          <Text style={styles.emptyText}>No habits yet. Start building your streaks!</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={openAddDialog}
        label="Add Habit"
        color={theme.colors.onPrimary}
        accessibilityLabel="Add New Habit"
      />
      <Portal>
        <Dialog visible={showAddDialog} onDismiss={closeAddDialog} style={styles.dialog}>
           <KeyboardAvoidingView
             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
             style={styles.keyboardAvoidingView}
             keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
           >
             <Dialog.Title style={styles.dialogTitle}>Add New Habit</Dialog.Title>
             <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Content style={styles.dialogContent}>
                 <TextInput
                   label="Habit Name"
                   value={newHabitName}
                   onChangeText={setNewHabitName}
                   mode="outlined"
                   style={styles.textInput}
                 />
                 <View style={styles.pickerContainer}>
                   <Picker
                      selectedValue={newHabitTraitId}
                      onValueChange={(itemValue) => setNewHabitTraitId(itemValue || undefined)}
                      style={styles.picker}
                      prompt="Link to Trait (Optional)"
                    >
                      <Picker.Item label="No Linked Trait" value={undefined} />
                      {traits.map((trait) => (
                        <Picker.Item key={trait.id} label={trait.name} value={trait.id} />
                      ))}
                    </Picker>
                 </View>
                 <TextInput
                      label="XP Value (Optional)"
                      value={newHabitXpValue}
                      onChangeText={setNewHabitXpValue}
                      mode="outlined"
                      style={styles.textInput}
                      keyboardType="numeric"
                 />
               </Dialog.Content>
             </ScrollView>
             <Dialog.Actions>
               <Button onPress={closeAddDialog}>Cancel</Button>
               <Button onPress={handleAddHabit} disabled={!newHabitName.trim()} mode="contained">Add</Button>
             </Dialog.Actions>
           </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={showEditDialog} onDismiss={closeEditDialog} style={styles.dialog}>
           <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <Dialog.Title style={styles.dialogTitle}>Edit Habit</Dialog.Title>
             <ScrollView contentContainerStyle={styles.scrollViewContent}>
               <Dialog.Content style={styles.dialogContent}>
                 <TextInput
                   label="Habit Name"
                   value={editName}
                   onChangeText={setEditName}
                   mode="outlined"
                   style={styles.textInput}
                 />
                 <View style={styles.pickerContainer}>
                   <Picker
                      selectedValue={editTraitId}
                      onValueChange={(itemValue) => setEditTraitId(itemValue || undefined)}
                      style={styles.picker}
                      prompt="Link to Trait (Optional)"
                    >
                      <Picker.Item label="No Linked Trait" value={undefined} />
                      {traits.map((trait) => (
                        <Picker.Item key={trait.id} label={trait.name} value={trait.id} />
                      ))}
                    </Picker>
                 </View>
                 <TextInput
                      label="XP Value (Optional)"
                      value={editXpValue}
                      onChangeText={setEditXpValue}
                      mode="outlined"
                      style={styles.textInput}
                      keyboardType="numeric"
                 />
               </Dialog.Content>
             </ScrollView>
             <Dialog.Actions>
               <Button onPress={closeEditDialog}>Cancel</Button>
               <Button onPress={handleEditHabitSave} disabled={!editName.trim()} mode="contained">Save Changes</Button>
             </Dialog.Actions>
           </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={showDeleteDialog} onDismiss={closeDeleteDialog} style={styles.dialog}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.deleteDialogText}>Are you sure you want to delete the habit "{deletingHabit?.name}"? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDeleteDialog}>Cancel</Button>
            <Button onPress={handleDeleteHabitConfirm} textColor={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
    </View>
  );
}
