import { Stack } from "expo-router"; 
import { PaperProvider } from "react-native-paper"; 
import { AppProvider } from "../contexts/AppContext";

export default function RootLayout() {
    return (
      <AppProvider>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Define screens for the main route groups */}
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            {/* Add other root screens like modals if needed */}
          </Stack>
        </PaperProvider>
      </AppProvider>
    );
}