import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
    const router = useRouter();
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.replace('/home')}>
                <Text>Enter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/registration/name')}>
                <Text>Register</Text>
            </TouchableOpacity>
        </View>
    );
}