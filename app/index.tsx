import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the dashboard tab
  return <Redirect href="/dashboard" />;
}
