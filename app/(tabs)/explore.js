import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Linking,
  SafeAreaView,
  Platform 
} from 'react-native';

export default function ExploreScreen() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explorar</Text>
          <Text style={styles.subtitle}>
            Información sobre la aplicación Mixer
          </Text>
        </View>

        {/* Card: Acerca de la app */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎵 Mixer App</Text>
          <Text style={styles.cardText}>
            Esta aplicación te permite crear música mezclando diferentes sonidos en tiempo real.
            Selecciona sonidos desde la biblioteca y asígnalos a los botones del mixer para crear
            tus propias composiciones musicales.
          </Text>
        </View>

        {/* Card: Cómo usar */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Cómo usar la aplicación</Text>
          <Text style={styles.cardText}>
            1. Ve al tab <Text style={styles.boldText}>Home</Text> para seleccionar sonidos
          </Text>
          <Text style={styles.cardText}>
            2. Ve al tab <Text style={styles.boldText}>Mixer</Text> para asignar sonidos a los botones
          </Text>
          <Text style={styles.cardText}>
            3. Toca los botones del mixer para reproducir los sonidos
          </Text>
          <Text style={styles.cardText}>
            4. Combina diferentes sonidos para crear música
          </Text>
        </View>

        {/* Card: Funcionalidades */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚡ Funcionalidades</Text>
          <Text style={styles.cardText}>• Biblioteca de sonidos organizada por categorías</Text>
          <Text style={styles.cardText}>• Reproducción en loop de los sonidos</Text>
          <Text style={styles.cardText}>• Control de play/pause individual</Text>
          <Text style={styles.cardText}>• Interfaz intuitiva y fácil de usar</Text>
          <Text style={styles.cardText}>• Soporte para múltiples sonidos simultáneos</Text>
        </View>

        {/* Card: Compatibilidad */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌐 Compatibilidad</Text>
          <Text style={styles.cardText}>
            Esta aplicación funciona en dispositivos Android, iOS y web.
            {Platform.OS === 'web' && ' Actualmente estás usando la versión web.'}
            {Platform.OS === 'android' && ' Actualmente estás en Android.'}
            {Platform.OS === 'ios' && ' Actualmente estás en iOS.'}
          </Text>
        </View>

        {/* Card: Enlaces útiles */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔗 Enlaces útiles</Text>
          
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openLink('https://docs.expo.dev/')}
          >
            <Text style={styles.linkText}>📚 Documentación de Expo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openLink('https://reactnative.dev/')}
          >
            <Text style={styles.linkText}>⚛️ React Native</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => openLink('https://docs.expo.dev/versions/latest/sdk/audio/')}
          >
            <Text style={styles.linkText}>🎵 Expo Audio API</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Mixer App v1.0 - Creado con React Native y Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  linkButton: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  linkText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
}); 