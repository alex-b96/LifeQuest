import React from 'react';
import { Tabs } from 'expo-router';
// import FontAwesome from '@expo/vector-icons/FontAwesome'; // Example icon library

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#6200ea' /* Example Color */ }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          // tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="traits"
        options={{
          title: 'Traits',
          // tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          // tabBarIcon: ({ color }) => <TabBarIcon name="bullseye" color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          // tabBarIcon: ({ color }) => <TabBarIcon name="repeat" color={color} />,
        }}
      />
    </Tabs>
  );
}
