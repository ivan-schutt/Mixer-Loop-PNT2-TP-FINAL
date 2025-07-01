import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const { setAuth } = useAuth(); 

    const handleRegister = async () => {
      if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
      }
      try{
          const response = await authService.register({ nombre, email, password });
          console.log('Usuario registrado:', response);
          setAuth(response)
      } catch (error) {
    alert(error.message || 'Error al registrar usuario');
  }};

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
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#ccc" 
          style={styles.input} 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput 
          placeholder="Contraseña" 
          placeholderTextColor="#ccc" 
          secureTextEntry 
          style={styles.input}
          value={password}
          onChangeText={setPassword} 
        />
        <TextInput 
          placeholder="Confirmar contraseña" 
          placeholderTextColor="#ccc" 
          secureTextEntry 
          style={styles.input}
          value={confirmarPassword}
          onChangeText={setConfirmarPassword}
        />

        <Button
          title="Registrarse"
          buttonStyle={{ backgroundColor: '#00b4db' }}
          titleStyle={{ fontWeight: 'bold' }}
          containerStyle={styles.buttonContainer}
          onPress={handleRegister}
        />

        <Button
          title="Volver"
          type="clear"
          titleStyle={{ color: '#ccc' }}
          onPress={() => router.back()}
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
