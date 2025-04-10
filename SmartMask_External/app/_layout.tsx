// app/_layout.tsx

import { Stack } from 'expo-router';
import { ResultsProvider } from './ResultsContext'; // ✅ same folder

export default function RootLayout() {
  return (
    <ResultsProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#25292e' },
          headerTintColor: 'white',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="imagereader" options={{ title: 'Image Reader' }} />
        <Stack.Screen name="results" options={{ title: 'Results' }} />
        <Stack.Screen name="result_history" options={{ title: 'Results History' }} />
        <Stack.Screen name="result_detail" options={{ title: 'Result Details' }} />
      </Stack>
    </ResultsProvider>
  );
}
