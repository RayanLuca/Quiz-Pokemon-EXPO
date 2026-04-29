import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import AnswerButton from './components/AnswerButton';

export default function Quiz() {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const [pokemon, setPokemon] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const getRandomId = () => Math.floor(Math.random() * 151) + 1;

  const fetchPokemon = async () => {
    try {
      const id = getRandomId();
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = res.data;

      const correct = data.name;
      let choices = [correct];

      while (choices.length < 4) {
        const r = await axios.get(`https://pokeapi.co/api/v2/pokemon/${getRandomId()}`);
        const name = r.data.name;
        if (!choices.includes(name)) {
          choices.push(name);
        }
      }

      choices.sort(() => Math.random() - 0.5);

      setPokemon(data);
      setOptions(choices);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleAnswer = (opt: string) => {
    if (showAnswer || gameOver) return;

    setSelected(opt);
    setShowAnswer(true);

    if (opt === pokemon.name) {
      setScore((prev) => prev + 1);
    } else {
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    }

    setTimeout(() => {
      setSelected(null);
      setShowAnswer(false);
      if (!gameOver) fetchPokemon();
    }, 1600);
  };

  if (gameOver) {
    return (
      <SafeAreaView style={styles.gameOverContainer}>
        <View style={styles.gameOverContent}>
          <Text style={styles.gameOverTitle}>💀 GAME OVER</Text>
          <Text style={styles.finalScoreLabel}>Sua pontuação</Text>
          <Text style={styles.scoreBig}>{score}</Text>

          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              setScore(0);
              setLives(3);
              setGameOver(false);
              fetchPokemon();
            }}
          >
            <Text style={styles.restartText}>JOGAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando Pokémon...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://wallpaperaccess.com/full/1794017.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>⭐ {score}</Text>
            </View>

            <View style={styles.livesContainer}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Text key={i} style={i < lives ? styles.heart : styles.heartEmpty}>
                  {i < lives ? '❤️' : '♡'}
                </Text>
              ))}
            </View>
          </View>

          {/* CARD PRINCIPAL */}
          <View style={[styles.card, isWeb && styles.cardWeb]}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: pokemon.sprites.front_default || 'https://via.placeholder.com/200',
                }}
                style={[styles.pokemonImage, isWeb && styles.pokemonImageWeb]}
              />
            </View>

            {/* Pergunta alinhada com os botões */}
            <View style={styles.questionContainer}>
              <Text style={styles.question}>Quem é esse Pokémon?</Text>
            </View>

            {showAnswer && (
              <Text
                style={[
                  styles.result,
                  selected === pokemon.name ? styles.resultCorrect : styles.resultWrong,
                ]}
              >
                {selected === pokemon.name
                  ? '🔥 Acertou!'
                  : `❌ Era ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`}
              </Text>
            )}

            {/* Opções - Alinhadas com a pergunta */}
            <View style={styles.optionsContainer}>
              {options.map((opt) => (
                <View key={opt} style={styles.buttonWrapper}>
                  <AnswerButton
                    title={opt.charAt(0).toUpperCase() + opt.slice(1)}
                    onPress={() => handleAnswer(opt)}
                    disabled={showAnswer}
                    isCorrect={opt === pokemon.name}
                    isSelected={opt === selected}
                    showAnswer={showAnswer}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Botão Sobre */}
          <TouchableOpacity
            style={styles.aboutButton}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.aboutText}>ℹ️ Sobre</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  safeArea: { flex: 1 },

  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  /* HEADER */
  header: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 30,
  },
  score: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: 'bold',
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  heart: { fontSize: 28 },
  heartEmpty: { fontSize: 28, color: '#444' },

  /* CARD */
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
    elevation: 20,
  },
  cardWeb: {
    maxWidth: 520,
    padding: 32,
  },

  imageContainer: {
    backgroundColor: '#111',
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#444',
  },
  pokemonImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  pokemonImageWeb: {
    width: 200,
    height: 200,
  },

  /* PERGUNTA ALINHADA */
  questionContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    marginBottom: 20,
  },
  question: {
    color: '#fff',
    fontSize: 23,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
  },

  result: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
    maxWidth: 320,
  },
  resultCorrect: { color: '#4ade80' },
  resultWrong: { color: '#f87171' },

  /* OPÇÕES ALINHADAS */
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
    marginLeft:80,
    gap: 14,
  },
  buttonWrapper: {
    width: '100%',
  },

  /* BOTÃO SOBRE */
  aboutButton: {
    marginTop: 40,
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  aboutText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  /* GAME OVER */
  gameOverContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverContent: {
    alignItems: 'center',
  },
  gameOverTitle: {
    fontSize: 46,
    color: '#ff4d4d',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  finalScoreLabel: {
    fontSize: 20,
    color: '#888',
    marginBottom: 8,
  },
  scoreBig: {
    fontSize: 88,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 50,
  },
  restartButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  restartText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* LOADING */
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});