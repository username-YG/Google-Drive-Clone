import { Stack } from 'expo-router';

export default function LoginLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }
        }}>
            <Stack.Screen name="username" />
            <Stack.Screen name="password" />
        </Stack>
    );
}