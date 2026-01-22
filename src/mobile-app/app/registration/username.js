import { useRouter } from 'expo-router';
import { UserNameStep } from  '../../components/Steps.js';
import useRegistration from '../../components/RegistrationContext.js';

export default function Username() {
  const router = useRouter();
  const {
    username, setUsername,
    errors, setStepError, clearStepError,
    usernameRef
  } = useRegistration();

  const error = errors.username;

  const onNext = () => {
    const usernameRegex = /^[a-z0-9.]+$/i;

    if (!username.trim()) {
      setStepError('username', 'Username is required');
      usernameRef.current?.focus();
      return;
    }

    if (!usernameRegex.test(username)) {
      setStepError('username', 'Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed.');
      usernameRef.current?.focus();
      return;
    }
    clearStepError('username');
    router.push('/registration/password');
  };

  return (
    <UserNameStep
      title="How you'll sign in"
      subtitle="Create a Gmail address for your new account"
      buttonTitle="Back"
      username={username}
      setUsername={setUsername}
      onNext={onNext}
      onBack={() => router.back()}
      error={error}
      inputRef={usernameRef}
    />
  );
}