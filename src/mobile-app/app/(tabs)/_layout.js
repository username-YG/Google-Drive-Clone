import { View, Text } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="Home" options={{ tabBarLabel: 'Home' }} />
            <Tabs.Screen name="Starred" options={{ tabBarLabel: 'Starred' }} />
            <Tabs.Screen name="Shared" options={{ tabBarLabel: 'Shared' }} />
            <Tabs.Screen name="Files" options={{ tabBarLabel: 'Files' }} />
        </Tabs>
    );
}