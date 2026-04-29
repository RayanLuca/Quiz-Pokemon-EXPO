import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AnswerButton({
  title,
  onPress,
  disabled,
  isCorrect,
  isSelected,
  showAnswer,
}) {
  let backgroundColor = '#FFD700';

  if (showAnswer) {
    if (isCorrect) {
      backgroundColor = '#4CAF50'; // verde
    } else if (isSelected) {
      backgroundColor = '#F44336'; // vermelho
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});