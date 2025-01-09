import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva'; // для темної теми
import AsyncStorage from '@react-native-async-storage/async-storage'; // для роботи з AsyncStorage

export default function HomeScreen({ navigation }) {

  const handleLogout = async () => {
    try {
      // Очистити токен з AsyncStorage
      await AsyncStorage.removeItem('auth_token');
      
      // Додати повідомлення, що користувач вийшов
      Alert.alert('Успіх', 'Ви вийшли з акаунту!');
      
      // Переходимо на сторінку логіну
      navigation.navigate('Register');
    } catch (error) {
      console.error('Помилка при виході:', error);
      Alert.alert('Помилка', 'Не вдалося вийти з акаунту');
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <View style={styles.container}>
        <Text style={styles.title}>Вітаємо!</Text>
        <Text style={styles.subtitle}>Це заглушка після успішного логіну.</Text>

        <Button
          title="Перейти до профілю"
          onPress={() => navigation.navigate('Profile')}
        />

        <Button
          title="Вийти"
          onPress={handleLogout}
          color="#ff6347" // колір для кнопки виходу
        />
      </View>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // фон для темної теми
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // колір для заголовку
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc', // колір для підзаголовку
    marginBottom: 20,
  },
});
