import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'lifequest_user';
const TRAITS_KEY = 'lifequest_traits';
// Add keys for goals, habits etc.

// Example function (implement actual logic)
export const saveUser = async (user: any) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save user data', e);
  }
};

export const loadUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load user data', e);
    return null;
  }
};

// Add similar functions for traits, goals, habits...
