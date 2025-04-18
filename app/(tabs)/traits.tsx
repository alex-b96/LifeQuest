import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppContext } from '../../contexts/AppContext'; 
import { TraitCard } from '../../components/traits/TraitCard'; 
import { Trait } from '../../models/Trait'; 

export default function TraitsScreen() {
  const { traits } = useAppContext(); 
  // const traits: Trait[] = []; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Traits</Text>
      {traits.length === 0 ? (
        <Text>No traits added yet.</Text>
      ) : (
        <FlatList
          data={traits} 
          renderItem={({ item }) => <TraitCard trait={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {/* Add button to add new trait */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
});
