import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card, IconButton, FAB, Portal, Dialog, TextInput } from 'react-native-paper';
import { habitService } from '../../services/habitService';
import { Habit } from '../../models/Habit';

const todayStr = () => new Date().toISOString().split('T')[0];

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    setLoading(true);
    const data = await habitService.getHabits();
    setHabits(data);
    setLoading(false);
  }

  async function handleCheckIn(habit: Habit) {
    await habitService.completeHabit(habit.id, todayStr());
    loadHabits();
  }

  async function handleAddHabit() {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      frequency: 'daily',
      createdAt: todayStr(),
      streak: 0,
      lastCompleted: null,
      completions: [],
    };
    await habitService.addHabit(habit);
    setNewHabit('');
    setShowAdd(false);
    loadHabits();
  }

  const renderHabit = ({ item }: { item: Habit }) => {
    const completedToday = item.completions.includes(todayStr());
    return (
      <Card style={{ marginBottom: 12 }}>
        <Card.Title title={item.name} subtitle={`Streak: ${item.streak}`} />
        <Card.Actions>
          <Button
            mode={completedToday ? 'contained' : 'outlined'}
            onPress={() => handleCheckIn(item)}
            disabled={completedToday}
            icon={completedToday ? 'check' : 'checkbox-blank-outline'}
          >
            {completedToday ? 'Checked In' : 'Check In'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habits</Text>
      {habits.length === 0 && !loading ? (
        <Text style={{ marginTop: 32 }}>No habits yet. Add one!</Text>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshing={loading}
          onRefresh={loadHabits}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowAdd(true)}
        label="Add Habit"
      />
      <Portal>
        <Dialog visible={showAdd} onDismiss={() => setShowAdd(false)}>
          <Dialog.Title>Add New Habit</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Habit Name"
              value={newHabit}
              onChangeText={setNewHabit}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button onPress={handleAddHabit}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 32,
  },
});
