import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Input, Button, ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva'; // імпортуємо тему eva.dark

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false); // Додаємо стан для перемикання між реєстрацією і логіном

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля');
      return;
    }

    const normalizedEmail = email.toLowerCase();
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      Alert.alert('Помилка', 'Будь ласка, введіть правильну електронну пошту');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Помилка', 'Пароль повинен містити мінімум 6 символів');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.188:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          password,
        }),
      });

      if (response.status === 200) {
        Alert.alert('Успіх', 'Користувач успішно зареєстрований!');
        navigation.navigate('Login');
      } else {
        const message = await response.text();
        Alert.alert('Помилка', message);
      }
    } catch (error) {
      console.error('Помилка з’єднання:', error);
      Alert.alert('Помилка', 'Не вдалося підключитися до сервера');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.188:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status === 200) {
        Alert.alert('Успіх', 'Ви успішно увійшли в систему!');
        navigation.navigate('Home'); // Перехід до головної сторінки або іншого екрану
      } else {
        const message = await response.text();
        Alert.alert('Помилка', message);
      }
    } catch (error) {
      console.error('Помилка з’єднання:', error);
      Alert.alert('Помилка', 'Не вдалося підключитися до сервера');
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <View style={styles.container}>
        <Text style={styles.title}>{isLogin ? 'Логін' : 'Реєстрація'}</Text>

        {!isLogin && (
          <>
            <Input
              style={[styles.input, styles.greyInput]}
              placeholder="Ім'я"
              value={name}
              onChangeText={setName}
            />
          </>
        )}

        <Input
          style={[styles.input, styles.greyInput]}
          placeholder="Електронна пошта"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Input
          style={[styles.input, styles.greyInput]}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          style={styles.registerButton}
          size="medium"
          textStyle={styles.buttonText}
          onPress={isLogin ? handleLogin : handleRegister}
        >
          {isLogin ? 'Увійти' : 'Зареєструватись'}
        </Button>

        <Button
          style={[styles.registerButton, styles.switchButton]}
          size="small"
          onPress={() => setIsLogin(!isLogin)} // Перемикаємо між реєстрацією та логіном
        >
          {isLogin ? 'Ще не зареєстровані? Реєстрація' : 'Вже є акаунт? Логін'}
        </Button>
      </View>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    marginBottom: 15,
  },
  greyInput: {
    backgroundColor: '#666',
    color: '#fff',
    borderRadius: 15,
  },
  registerButton: {
    backgroundColor: '#008000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  switchButton: {
    backgroundColor: '#444',
    marginTop: 10,
  },
});
