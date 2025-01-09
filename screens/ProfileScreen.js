import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Отримуємо токен з локального сховища
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Помилка', 'Токен не знайдено');
          setLoading(false);
          return;
        }

        // Робимо запит до сервера для отримання даних користувача
        const response = await fetch('http://192.168.0.188:5000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Додаємо токен у заголовок
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setUserData(data); // Зберігаємо дані користувача у стані
        } else {
          Alert.alert('Помилка', 'Не вдалося отримати дані користувача');
        }
      } catch (error) {
        console.error('Помилка:', error);
        Alert.alert('Помилка', 'Не вдалося підключитися до сервера');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Дані користувача не знайдено</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профіль</Text>
      <Text style={styles.info}>Ім'я: {userData.name}</Text>
      <Text style={styles.info}>Електронна пошта: {userData.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});
