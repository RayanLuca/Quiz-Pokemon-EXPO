import { router } from 'expo-router';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Home() {
  return (
    <ImageBackground
      source={{
        uri: 'https://wallpapers.com/images/hd/pokemon-phone-violet-ghost-pokemon-6506jtzhkv2yupkt.jpg',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Pokemon Quiz</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/quiz')}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // deixa legível
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FFD700',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});