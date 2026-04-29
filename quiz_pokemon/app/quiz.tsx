import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import AnswerButton from './components/AnswerButton';

export default function Quiz() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const getRandomId = () => Math.floor(Math.random() * 151) + 1;

  const fetchPokemon = async () => {
    try {
      const id = getRandomId();

      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = res.data;

      const correct = data.name;
      let choices = [correct];

      while (choices.length < 4) {
        const r = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${getRandomId()}`
        );

        if (!choices.includes(r.data.name)) {
          choices.push(r.data.name);
        }
      }

      choices = choices.sort(() => Math.random() - 0.5);

      setPokemon(data);
      setOptions(choices);
    } catch (error) {
      console.log('Erro ao buscar Pokémon:', error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleAnswer = (opt: string) => {
    if (showAnswer) return;

    setSelected(opt);
    setShowAnswer(true);

    if (opt === pokemon.name) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelected(null);
      setShowAnswer(false);
      fetchPokemon();
    }, 2000);
  };

  if (!pokemon) return null;

  return (
    <ImageBackground
      source={{
        uri: 'https://media-assets.wired.it/photos/6997c0a7a627800fde2e4ca7/16:9/w_2560%2Cc_limit/Pokemon-cover.png',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.score}>Pontuação: {score}</Text>

        <Image
          source={{
            uri:
              pokemon.sprites.front_default ||
              'https://via.placeholder.com/150',
          }}
          style={styles.image}
        />

        <Text style={styles.question}>Qual é esse Pokémon?</Text>

        {showAnswer && (
          <Text style={styles.result}>
            {selected === pokemon.name
              ? '🔥 Acertou!'
              : `❌ Errou! Era ${pokemon.name}`}
          </Text>
        )}

        {options.map((opt) => (
          <AnswerButton
            key={opt}
            title={opt}
            onPress={() => handleAnswer(opt)}
            disabled={showAnswer}
            isCorrect={opt === pokemon.name}
            isSelected={opt === selected}
            showAnswer={showAnswer}
          />
        ))}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  question: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 10,
  },
  score: {
    color: '#FFD700',
    fontSize: 18,
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    marginBottom: 15,
    color: '#fff',
  },
});