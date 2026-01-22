import { useRouter } from 'expo-router';
import { PasswordStep } from  '../../components/Steps.js';
import { useRegistration } from '../../components/RegistrationContext.js';

export default function Password() {
  const router = useRouter();
  const {
    password, setPassword,
    errors, setStepError, clearStepError,
    passwordRef
  } = useRegistration();

  const error = errors.password;

  const onNext = () => {
    if (password.length < 8) {
      setStepError('password', 'Use 8 characters or more for your password');
      passwordRef.current?.focus();
      return;
    }
    clearStepError('password');
    router.push('/registration/profilePic');
  };

  return (
    <PasswordStep
      title="Create a strong password"
      subtitle="Create a strong password with a mixture of letters, numbers and symbols"
      password={password}
      setPassword={setPassword}
      onNext={onNext}
      onBack={() => router.back()}
      error={error}
      inputRef={passwordRef}
    />
  );
}