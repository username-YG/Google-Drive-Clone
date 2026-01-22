import { useRouter } from 'expo-router';
import { ProfilePicStep } from  '../../components/Steps.js';
import { useRegistration } from '../../components/RegistrationContext.js';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilePic() {
  const router = useRouter();
  const {
    firstName, lastName,
    setFirstName, setLastName,
    username, password,
    setUsername,
    setPassword,
    profilePic, setProfilePic,
    errors, setStepError, clearStepError,
  } = useRegistration();

  const error = errors.profilePic;

  const handleSubmit = async () => {
    const displayName = `${firstName} ${lastName}`.trim();


    try {
      
      const hostIp = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
      const port = Constants.expoConfig.extra.VITE_WEB_PORT || 3000;

      const response = await fetch(`http://${hostIp}:${port}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          displayName,
          profilePic
        })
      });

      if (response.status == 201) {
        setFirstName('');
        setLastName('');
        setUsername('');
        setPassword('');
        setProfilePic(null);
        clearStepError('name');
        clearStepError('username');
        clearStepError('password');
        clearStepError('profilePic');
        router.replace('/login');
      } else {
        const data = await response.json();
        setStepError('profilePic', data.error || 'Registration failed');
      }
    } catch (err) {
      console.log(err)
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