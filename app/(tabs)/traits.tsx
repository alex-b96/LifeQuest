import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, List, FAB, Portal, Dialog, TextInput, Button, Card, ProgressBar, IconButton } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';
import { Trait } from '../../models/Trait';

export default function TraitsScreen() {
  const { traits, addTrait, updateTrait, deleteTrait } = useAppContext();
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [newTraitName, setNewTraitName] = useState('');
  const [newTraitDescription, setNewTraitDescription] = useState('');

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingTrait, setEditingTrait] = useState<Trait | null>(null);
  const [editTraitName, setEditTraitName] = useState('');
  const [editTraitDescription, setEditTraitDescription] = useState('');

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deletingTrait, setDeletingTrait] = useState<Trait | null>(null);

  const showAddDialog = () => setAddDialogVisible(true);
  const hideAddDialog = () => {
    setAddDialogVisible(false);
    setNewTraitName('');
    setNewTraitDescription('');
  };

  const handleAddTrait = async () => {
    if (newTraitName.trim()) {
      await addTrait({ name: newTraitName.trim(), description: newTraitDescription.trim() });
      hideAddDialog();
    }
  };

  const showEditDialog = (trait: Trait) => {
    setEditingTrait(trait);
    setEditTraitName(trait.name);
    setEditTraitDescription(trait.description || '');
    setEditDialogVisible(true);
  };

  const hideEditDialog = () => {
    setEditDialogVisible(false);
    setEditingTrait(null);
    setEditTraitName('');
    setEditTraitDescription('');
  };

  const handleUpdateTrait = async () => {
    if (editingTrait && editTraitName.trim()) {
      await updateTrait({
        ...editingTrait,
        name: editTraitName.trim(),
        description: editTraitDescription.trim()
      });
      hideEditDialog();
    }
  };

  const showDeleteDialog = (trait: Trait) => {
    setDeletingTrait(trait);
    setDeleteDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setDeletingTrait(null);
  };

  const handleDeleteTrait = async () => {
    if (deletingTrait) {
      await deleteTrait(deletingTrait.id);
      hideDeleteDialog();
    }
  };

  const renderTrait = ({ item }: { item: Trait }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.description || 'No description'} />
      <Card.Content>
        <Text>Level: {item.level}</Text>
        <Text>Experience: {item.experiencePoints}</Text>
        <ProgressBar progress={(item.experiencePoints % 100) / 100} style={styles.progressBar} />
        <Text style={styles.lastUpdatedText}>Last Updated: {new Date(item.lastUpdated).toLocaleDateString()}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="pencil" onPress={() => showEditDialog(item)} />
        <IconButton icon="delete" onPress={() => showDeleteDialog(item)} />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={traits}
        renderItem={renderTrait}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No traits defined yet. Add one!</Text>}
        contentContainerStyle={styles.listContent}
      />

      <Portal>
        <Dialog visible={addDialogVisible} onDismiss={hideAddDialog} style={styles.dialog}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Title>Add New Trait</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Trait Name"
                  value={newTraitName}
                  onChangeText={setNewTraitName}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Description"
                  value={newTraitDescription}
                  onChangeText={setNewTraitDescription}
                  mode="outlined"
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                />
              </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={hideAddDialog}>Cancel</Button>
              <Button onPress={handleAddTrait} disabled={!newTraitName.trim()}>Add</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={editDialogVisible} onDismiss={hideEditDialog} style={styles.dialog}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Title>Edit Trait</Dialog.Title>
              <Dialog.Content>
                <TextInput label="Trait Name" value={editTraitName} onChangeText={setEditTraitName} mode="outlined" style={styles.input} />
                <TextInput label="Description" value={editTraitDescription} onChangeText={setEditTraitDescription} mode="outlined" style={styles.input} multiline numberOfLines={3} />
              </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={hideEditDialog}>Cancel</Button>
              <Button onPress={handleUpdateTrait} disabled={!editTraitName.trim()}>Save Changes</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete the trait "{deletingTrait?.name}"? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancel</Button>
            <Button onPress={handleDeleteTrait} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={showAddDialog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  progressBar: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  dialog: {
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  }
});
