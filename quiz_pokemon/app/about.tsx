import { Image, StyleSheet, Text, View } from 'react-native';

export default function About() {
  return (
    <View style={styles.container}>
      
      <Image
        source={{
          uri: 'https://avatars.githubusercontent.com/u/200686127?v=4'
        }}
        style={styles.image}
      />

      <Text style={styles.title}>Pokemon Quiz</Text>

      <Text style={styles.text}>
        Este é um quiz Pokémon feito com Expo + PokéAPI 🎮
      </Text>

      <Text style={styles.subtex}>
        Criado Por: Rayan Luca Teixeira
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(44, 47, 54)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  subtex:{
    color:'#00ff26',
    marginBottom: 10,
    fontWeight: 'bold',

    

  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});