import { Stack } from 'expo-router';
import { RegistrationProvider } from '../../components/RegistrationContext.js';

export default function RegistrationLayout() {
    return (
        <RegistrationProvider>
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' }
            }}>
                <Stack.Screen name="name" />
                <Stack.Screen name="username" />
                <Stack.Screen name="password" />
                <Stack.Screen name="profilePic" />
            </Stack>
        </RegistrationProvider>
    );
}