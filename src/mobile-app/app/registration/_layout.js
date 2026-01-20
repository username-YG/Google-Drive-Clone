import { Stack } from 'expo-router';
import { RegistrationProvider } from './RegistrationContext';

export default function RegistrationLayout() {
  return (
      <RegistrationProvider>
        <Stack screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Stack.Screen name="name" />
        <Stack.Screen name="username" />
        <Stack.Screen name="password" />
        <Stack.Screen name="profilePic" />
      </Stack>
    </RegistrationProvider>
  );
}