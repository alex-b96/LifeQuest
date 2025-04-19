import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, Button, Card, IconButton, FAB, Portal, Dialog, TextInput, useTheme, Avatar, MD3Theme } from 'react-native-paper';
import { habitService } from '../../services/habitService';
import { Habit } from '../../models/Habit';

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
});

export default function HabitsScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    setLoading(true);
    const data = await habitService.getHabits();
    setHabits(data);
    setLoading(false);
  }

  async function handleCheckIn(habit: Habit, completed: boolean) {
    if (completed) {
      await habitService.uncompleteHabit(habit.id, todayStr());
    } else {
      await habitService.completeHabit(habit.id, todayStr());
    }
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
      <Card style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]}>
        <Card.Title
          title={<Text style={styles.habitTitle}>{item.name}</Text>}
          subtitle={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Icon size={24} icon="fire" color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.primary, marginRight: 6 }} />
              <Text style={styles.streakText}>{item.streak} day streak</Text>
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
            onPress={() => handleCheckIn(item, completedToday)}
            icon={completedToday ? 'close' : 'check'}
            style={{ borderRadius: 20 }}
            labelStyle={!completedToday ? { color: theme.colors.primary } : {}}
          >
            {completedToday ? 'Uncheck' : 'Check In'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {habits.length === 0 && !loading ? (
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
          refreshing={loading}
          onRefresh={loadHabits}
        />
      )}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setShowAdd(true)}
        label="Add Habit"
        color={theme.colors.onPrimary}
      />
      <Portal>
        {/* Add Dialog */}
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
        {/* Edit Dialog */}
        <Dialog visible={!!editHabit} onDismiss={() => setEditHabit(null)}>
          <Dialog.Title>Edit Habit</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Habit Name"
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditHabit(null)}>Cancel</Button>
            <Button
              onPress={async () => {
                if (editHabit && editName.trim()) {
                  await habitService.updateHabit({ ...editHabit, name: editName.trim() });
                  setEditHabit(null);
                  setEditName('');
                  loadHabits();
                }
              }}
            >Save</Button>
          </Dialog.Actions>
        </Dialog>
        {/* Delete Confirm Dialog */}
        <Dialog visible={!!deleteHabitId} onDismiss={() => setDeleteHabitId(null)}>
          <Dialog.Title>Delete Habit</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this habit?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteHabitId(null)}>Cancel</Button>
            <Button
              onPress={async () => {
                if (deleteHabitId) {
                  await habitService.deleteHabit(deleteHabitId);
                  setDeleteHabitId(null);
                  loadHabits();
                }
              }}
              color="red"
            >Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
