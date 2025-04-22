import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Text, Button, Card, IconButton, FAB, Portal, Dialog, TextInput, useTheme, Avatar, MD3Theme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; 
import { Habit } from '../../models/Habit';
import { useAppContext } from '../../contexts/AppContext';

const todayStr = () => new Date().toISOString().split('T')[0];

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: theme.colors.background,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 8,
    color: theme.colors.onSurface,
  },
  streakText: {
    fontSize: 16,
    marginLeft: 6,
    color: theme.colors.onSurface,
  },
  xpText: { 
    fontSize: 12, 
    color: theme.colors.primary,
    marginLeft: 8, 
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
  },
  pickerContainer: { 
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  picker: { 
  },
  textInput: { 
    marginTop: 8,
  }
});

export default function HabitsScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { habits, traits, addHabit, updateHabit, deleteHabit, completeHabit } = useAppContext(); 

  const [showAdd, setShowAdd] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTraitId, setNewHabitTraitId] = useState<string | undefined>(undefined); 
  const [newHabitXpValue, setNewHabitXpValue] = useState<string>('10'); 

  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState('');
  const [editTraitId, setEditTraitId] = useState<string | undefined>(undefined); 
  const [editXpValue, setEditXpValue] = useState<string>(''); 

  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null);

  async function handleCheckIn(habit: Habit) {
    const today = todayStr();
    const completedToday = habit.completions?.includes(today);

    if (completedToday) {
      const updatedCompletions = habit.completions?.filter(date => date !== today) ?? [];
      const updatedStreak = habit.lastCompleted === today ? Math.max(0, (habit.streak ?? 0) - 1) : habit.streak;
      const newLastCompleted = updatedCompletions.length > 0 ? [...updatedCompletions].sort().pop() : null;
      await updateHabit({ 
        ...habit, 
        completions: updatedCompletions,
        streak: updatedStreak,
        lastCompleted: newLastCompleted ?? null
      });
    } else {
      // Complete: Use context function which handles XP and streak updates
      // Pass only habitId and date, as context function fetches habit details
      await completeHabit(habit.id, today);
    }
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
    setNewHabitName('');
    setNewHabitTraitId(undefined);
    setNewHabitXpValue('10');
    setShowAdd(false);
  }

  async function handleEditHabitSave() {
    if (editHabit && editName.trim()) {
      const xpValue = parseInt(editXpValue, 10);
      const finalXpValue = !isNaN(xpValue) && editXpValue.trim() !== '' ? xpValue : undefined;

      await updateHabit({ 
        ...editHabit, 
        name: editName.trim(),
        traitId: editTraitId, 
        xpValue: finalXpValue 
      });
      setEditHabit(null);
      setEditName('');
      setEditTraitId(undefined);
      setEditXpValue('');
    }
  }

  async function handleDeleteHabitConfirm() {
    if (deleteHabitId) {
      await deleteHabit(deleteHabitId);
      setDeleteHabitId(null);
    }
  }

  const renderHabit = ({ item }: { item: Habit }) => {
    const completedToday = item.completions?.includes(todayStr()); 
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]}>
        <Card.Title
          title={<Text style={styles.habitTitle}>{item.name}</Text>}
          subtitle={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Icon size={24} icon="fire" color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.primary, marginRight: 6 }} />
              <Text style={styles.streakText}>{item.streak ?? 0} day streak</Text> 
              {item.xpValue ? <Text style={styles.xpText}>(+{item.xpValue} XP)</Text> : null}
            </View>
          }
          right={(props) => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton
                {...props}
                icon="pencil"
                onPress={() => {
                  setEditHabit(item); 
                  setEditName(item.name); 
                  setEditTraitId(item.traitId); 
                  setEditXpValue(item.xpValue?.toString() ?? ''); 
                }}
                accessibilityLabel="Edit Habit"
              />
              <IconButton
                {...props}
                icon="delete"
                onPress={() => setDeleteHabitId(item.id)}
                accessibilityLabel="Delete Habit"
              />
            </View>
          )}
        />
        <Card.Actions>
          <Button
            mode={completedToday ? 'contained' : 'outlined'}
            onPress={() => handleCheckIn(item)} 
            icon={'check'} 
            style={{ borderRadius: 20 }}
            labelStyle={!completedToday ? { color: theme.colors.primary } : {}}
          >
            {completedToday ? 'Completed' : 'Check In'}
          </Button>
        </Card.Actions>
      </Card>
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
          renderItem={renderHabit}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        />
      )}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]} 
        icon="plus"
        onPress={() => {
          setNewHabitName('');
          setNewHabitTraitId(undefined);
          setNewHabitXpValue('10');
          setShowAdd(true);
        }}
        label="Add Habit"
        color={theme.colors.onPrimary}
      />
      <Portal>
        {/* Add Habit Dialog */}
        <Dialog visible={showAdd} onDismiss={() => setShowAdd(false)}>
          <Dialog.Title>Add New Habit</Dialog.Title>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust offset as needed
          >
            <ScrollView>
              <Dialog.Content style={{ paddingBottom: 50 }}>
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
                  >
                    <Picker.Item label="Link to Trait (Optional)" value={undefined} />
                    {traits.map(trait => (
                      <Picker.Item key={trait.id} label={trait.name} value={trait.id} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  label="XP Value (Optional)"
                  value={newHabitXpValue}
                  onChangeText={setNewHabitXpValue}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </Dialog.Content>
            </ScrollView>
          </KeyboardAvoidingView>
          <Dialog.Actions>
            <Button onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button onPress={handleAddHabit}>Add</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Edit Habit Dialog */}
        <Dialog visible={!!editHabit} onDismiss={() => setEditHabit(null)}>
          <Dialog.Title>Edit Habit</Dialog.Title>
           <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust offset as needed
          >
            <ScrollView>
              <Dialog.Content style={{ paddingBottom: 50 }}>
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
                  >
                    <Picker.Item label="Link to Trait (Optional)" value={undefined} />
                    {traits.map(trait => (
                      <Picker.Item key={trait.id} label={trait.name} value={trait.id} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  label="XP Value (Optional)"
                  value={editXpValue}
                  onChangeText={setEditXpValue}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </Dialog.Content>
            </ScrollView>
          </KeyboardAvoidingView>
          <Dialog.Actions>
            <Button onPress={() => setEditHabit(null)}>Cancel</Button>
            <Button onPress={handleEditHabitSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog visible={!!deleteHabitId} onDismiss={() => setDeleteHabitId(null)}>
          <Dialog.Title>Delete Habit</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this habit?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteHabitId(null)}>Cancel</Button>
            <Button onPress={handleDeleteHabitConfirm} color={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
