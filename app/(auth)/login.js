import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';


export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(`Intentando iniciar sesión con: ${email}`);

    authService.login(email, password).then((response) => {
      console.log('response', response);
      setAuth(response);
    }).catch((error) => {
      console.log('error', error);
      alert(error);
    })
    
  }

  return (
    <LinearGradient
      colors={['#00b4db', '#121212', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Button
        title="Ingresar"
        onPress={handleLogin}
        buttonStyle={{ backgroundColor: '#00b4db' }}
        titleStyle={{ fontWeight: 'bold' }}
        containerStyle={styles.buttonContainer}
      />

      <Button
        title="Volver"
        type="clear"
        titleStyle={{ color: '#ccc' }}
        onPress={() => { router.back() }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
    borderWidth: 1,
    borderColor: '#333'
  },
  buttonContainer: {
    marginBottom: 20,
  },
});