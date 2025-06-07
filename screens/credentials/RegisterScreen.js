import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#00b4db', '#121212', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput 
          placeholder="Nombre completo" 
          placeholderTextColor="#ccc" 
          style={styles.input} 
          autoCapitalize="words"
        />
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#ccc" 
          style={styles.input} 
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          placeholder="Contraseña" 
          placeholderTextColor="#ccc" 
          secureTextEntry 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Confirmar contraseña" 
          placeholderTextColor="#ccc" 
          secureTextEntry 
          style={styles.input} 
        />

        <Button
          title="Registrarse"
          buttonStyle={{ backgroundColor: '#00b4db' }}
          titleStyle={{ fontWeight: 'bold' }}
          containerStyle={styles.buttonContainer}
          onPress={() => console.log('Registrar usuario')}
        />

        <Button
          title="Volver"
          type="clear"
          titleStyle={{ color: '#ccc' }}
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
});
