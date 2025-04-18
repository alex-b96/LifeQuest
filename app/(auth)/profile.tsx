import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { useAppContext } from '../../contexts/AppContext';
// import Button from '../../components/common/Button';

export default function ProfileScreen() {
  // const { user, setUser } = useAppContext();

  const handleLogout = () => {
    // Clear user data from context and storage
    // setUser(null);
    // Clear storage...
    // Navigate to auth flow (e.g., onboarding or login)
    // router.replace('/onboarding');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {/* Display user information */}
      <Text>Name: {/* user?.name || '...' */}</Text>
      <Text>Email: {/* user?.email || '...' */}</Text>
      {/* Add options to edit profile, change password, etc. */}

      {/* <Button title="Logout" onPress={handleLogout} /> */}
      <Text onPress={handleLogout} style={{color: 'red', marginTop: 20}}>Logout (Temporary Link)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
