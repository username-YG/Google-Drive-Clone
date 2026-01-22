import { View, Image, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { Input } from '../components/Input.js';
import { Logo } from '../components/GoogleLogo.js';
import { NextButton } from '../components/NextButton.js';
import { BackButton } from '../components/BackButton.js';
import { styles } from '../styles/registration.styles.js';


export function NameStep({ buttonTitle, firstName, setFirstName, lastName, setLastName, onBack, onNext, error, inputRef }) {
  const surnameRef = useRef(null);

  return (
    <SafeAreaView style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.upperContent}>
            <Logo title="Create a Google Account" subtitle="Enter your name" />

            <View style={styles.input}>
              <Input
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                ref={inputRef}
                error={error}
              />

              <Input
                placeholder="Surname (optional)"
                value={lastName}
                onChangeText={setLastName}
                ref={surnameRef}
              />
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.footerRow}>
            <BackButton title={buttonTitle} onPress={onBack} />
            <NextButton title="Next" onPress={onNext} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export function UserNameStep({ title, subtitle, buttonTitle, username, setUsername, onNext, onBack, error, inputRef }) {
  return (
    <SafeAreaView style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.upperContent}>
            <Logo
              title={title}
              subtitle={subtitle}
            />

            <View style={styles.input}>
              <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                error={error}
                ref={inputRef}
              />
            </View>
          </View>

          <View style={styles.footerRow}>
            <BackButton title={buttonTitle} onPress={onBack} />
            <NextButton title="Next" onPress={onNext} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export function PasswordStep({ title, subtitle, password, setPassword, onNext, onBack, error, inputRef }) {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <SafeAreaView style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.upperContent}>
            <Logo
              title={title}
              subtitle={subtitle}
            />

            <View style={styles.inputAndCheckbox}>
              <View style={styles.input}>
                <Input
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  error={error}
                  ref={inputRef}
                />
              </View>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={1}
              >
                <Checkbox
                  value={showPassword}
                  onValueChange={setShowPassword}
                  color={showPassword ? '#1a73e8' : '#dadce0'}
                />
                <Text style={styles.checkboxText}>Show password</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerRow}>
            <BackButton title="Back" onPress={onBack} />
            <NextButton title="Next" onPress={onNext} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export function ProfilePicStep({ profilePic, pickImage, onBack, onFinish, error }) {
  return (
    <SafeAreaView style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.upperContent}>
            <Logo title="Add a profile picture" subtitle="(optional)" />

            <View style={styles.uploadWrapper}>
              <TouchableOpacity
                style={styles.dashedCircle}
                onPress={pickImage}
              >
                {profilePic ? (
                  <Image source={{ uri: profilePic }} style={styles.imageFill} />
                ) : (
                  <MaterialIcons name="add" size={40} color="#dadce0" />
                )}
              </TouchableOpacity>
            </View>
            
            {!!error && (
              <View style={styles.errorRow}>
                  <MaterialIcons name="error" size={16} color='#d93025' />
                  <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>

          <View style={styles.footerRow}>
            <BackButton title="Back" onPress={onBack} />
            <NextButton title="Finish" onPress={onFinish} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}