import { useRouter } from 'expo-router';
import { ProfilePicStep } from  '../../components/Steps.js';
import { useRegistration } from './RegistrationContext';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilePic() {
  const router = useRouter();
  const {
    firstName, lastName,
    username, password,
    profilePic, setProfilePic,
    errors, setStepError, clearStepError,
  } = useRegistration();

  const error = errors.profilePic;

  const handleSubmit = async () => {
    const displayName = `${firstName} ${lastName}`.trim();

    try {
      const port = Constants.expoConfig.extra.VITE_WEB_PORT || 3000;
      const response = await fetch(`http://localhost:${port}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          displayName,
          profilePic
        })
      });

      console.log("hello");

      if (response.status == 201) {
        router.replace('/login');
      } else {
        const data = await response.json();
        setStepError('profilePic', data.error || 'Registration failed');
      }
    } catch {
      setStepError('profilePic', 'Cannot connect to server');
    }
  };

  return (
    <ProfilePicStep
      pickImage={async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          setProfilePic(result.assets[0].uri);
        }
      }}
      profilePic={profilePic}
      onBack={() => router.back()}
      onFinish={handleSubmit}
    />
  );
}