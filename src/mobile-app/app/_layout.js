import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack initialRouteName='login'>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="recent" options={{ headerShown: false }} />
            <Stack.Screen name="registration" options={{ headerShown: false }} />
            <Stack.Screen name="trash" options={{ headerShown: false }} />
            <Stack.Screen name="uploads" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}