import { Stack } from "expo-router";

export default function LoginLayout() {
    return (
        <Stack
            initialRouteName="username"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }} 
        />
    );
}