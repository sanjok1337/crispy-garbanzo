import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 

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
      const { token } = await response.json();

      // Зберігаємо токен у локальному сховищі
      await AsyncStorage.setItem('userToken', token);

      Alert.alert('Успіх', 'Ви успішно увійшли до системи!');
      navigation.navigate('Home');
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
    <View style={styles.container}>
      <Text style={styles.title}>Логін</Text>

      <TextInput
        style={styles.input}
        placeholder="Електронна пошта"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Увійти" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
