import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Define screens within the auth flow */}
      <Stack.Screen name="onboarding" />
      {/* Add login/signup screens here if needed */}
      {/* Profile might live in the main tab layout or here depending on flow */}
      {/* <Stack.Screen name="profile" /> */}
    </Stack>
  );
}
