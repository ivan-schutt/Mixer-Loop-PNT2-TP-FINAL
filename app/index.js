import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#00b4db', '#121212', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.subtitle}>Chori-Mixer</Text>
      <Text style={styles.title}>¡Te damos la bienvenida a la app para músicos!</Text>

      <View>
        <Link href="/login" asChild>
        <Button
          title="Iniciar Sesión"
          type="outline"
          buttonStyle={{
            borderColor: '#00b4db',
            borderWidth: 2,
          }}
          titleStyle={{ color: '#00b4db' }}
        />
        </Link>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/register" asChild>
        <Button
          title="Registrarse"
          buttonStyle={{
            backgroundColor: '#00b4db',
          }}
          titleStyle={{ color: '#fff', fontWeight: 'bold' }}
          
        />
        </Link>
      </View>
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 200,
    color: '#fff'
  },
  subtitle:{
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 50,
    color: '#fff'
  },
  buttonContainer: {
    marginVertical: 10,
  }
});
