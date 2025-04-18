import { View, Text, StyleSheet } from "react-native";
// import { useContext } from "react"; // No longer needed
import { useAppContext } from "../../contexts/AppContext"; // Import the custom hook
import { DailyOverview } from "../../components/dashboard/DailyOverview";
// import { useStorage } from "../../hooks/useStorage";

export default function Dashboard() {
  const { user } = useAppContext(); // Use the custom hook
  // Check if context is defined before accessing user
  const userName = user?.name || 'Explorer';

  // useStorage(); // Load stored data - consider calling this at a higher level (e.g., root layout)

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
      >
        Welcome, {userName}!
      </Text>
      <DailyOverview />
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
});