import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput } from 'react-native';

export default function LoginScreen({ navigation }) {
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#00b4db', '#121212', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput placeholder="Email" placeholderTextColor="#ccc" style={styles.input} />
      <TextInput placeholder="Contraseña" placeholderTextColor="#ccc" secureTextEntry style={styles.input} />

    <Link href="/(tabs)" asChild>
      <Button
        title="Ingresar"
        buttonStyle={{ backgroundColor: '#00b4db' }}
        titleStyle={{ fontWeight: 'bold' }}
        containerStyle={styles.buttonContainer}
      />
    </Link>
      <Button
        title="Volver"
        type="clear"
        titleStyle={{ color: '#ccc' }}
        onPress={() => { router.back()}}
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
  },
  buttonContainer: {
    marginBottom: 20,
  },
});
