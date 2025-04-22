import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, FAB, Portal, Dialog, TextInput, Button, useTheme, MD3Theme } from 'react-native-paper';
import { useAppContext } from '../../contexts/AppContext';
import { Trait } from '../../models/Trait';
import { TraitCard } from '../../components/traits/TraitCard';

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.primary,
  },
  input: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: theme.colors.onSurfaceVariant,
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
  deleteButton: {
  }
});

export default function TraitsScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);
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

  const renderItem = ({ item }: { item: Trait }) => (
    <TraitCard
      trait={item}
      onEdit={showEditDialog}
      onDelete={showDeleteDialog}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={traits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No traits defined yet. Add one!</Text>}
        contentContainerStyle={styles.listContent}
      />

      <Portal>
        <Dialog visible={addDialogVisible} onDismiss={hideAddDialog} style={styles.dialog}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          >
            <Dialog.Title style={styles.dialogTitle}>Add New Trait</Dialog.Title>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Content style={styles.dialogContent}>
                <TextInput
                  label="Trait Name"
                  value={newTraitName}
                  onChangeText={setNewTraitName}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Description (Optional)"
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
              <Button onPress={handleAddTrait} disabled={!newTraitName.trim()} mode="contained">Add</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={editDialogVisible} onDismiss={hideEditDialog} style={styles.dialog}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <Dialog.Title style={styles.dialogTitle}>Edit Trait</Dialog.Title>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Dialog.Content style={styles.dialogContent}>
                <TextInput label="Trait Name" value={editTraitName} onChangeText={setEditTraitName} mode="outlined" style={styles.input} />
                <TextInput label="Description (Optional)" value={editTraitDescription} onChangeText={setEditTraitDescription} mode="outlined" style={styles.input} multiline numberOfLines={3} />
              </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={hideEditDialog}>Cancel</Button>
              <Button onPress={handleUpdateTrait} disabled={!editTraitName.trim()} mode="contained">Save Changes</Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>

        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog} style={styles.dialog}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.deleteDialogText}>Are you sure you want to delete the trait "{deletingTrait?.name}"? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancel</Button>
            <Button onPress={handleDeleteTrait} textColor={theme.colors.error} style={styles.deleteButton}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={showAddDialog}
        color={theme.colors.onPrimary}
        accessibilityLabel="Add New Trait"
      />
    </View>
  );
}
