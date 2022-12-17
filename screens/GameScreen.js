import { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Alert, FlatList } from "react-native";
import Title from "../components/UI/Title";
import NumberContainer from "../components/Game/NumberContainer";
import PrimaryButton from "../components/UI/PrimaryButton";
import Card from "../components/UI/Card";
import InstructionText from "../components/UI/InstructionText";
import { Ionicons } from "@expo/vector-icons";
import GuessLogItem from "../components/Game/GuessLogItem";
/**
 * 1. Math.random() generates a number between 0 and 1.
 * 2. (max - min) makes sure that when we multiply it with the random number it is between max and min.
 * 3. Math.floor() will round the number.
 * 4. Adding min will make sure we don't get 0.
 *
 * @param {*} min
 * @param {*} max
 * @param {*} exclude makes sure that the phone if guesses the number on first guess again generates a random
 *            number. Also, the guess which is already made also gets excluded after the 1st turn.
 * @returns
 */
const generateRandomBetween = (min, max, exclude) => {
  console.log("Min: " + min + "Max: " + max);
  const randNum = Math.floor(Math.random() * (max - min)) + min;

  if (randNum == exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return randNum;
  }
};

//Does not change when the component is reevaluated.
let minBoundary = 1;
let maxBoundary = 100;

const GameScreen = ({ userNumber, onGameOver }) => {
  //Initial guess when we first time load the screen. It gets evaluated whenever the component is re-evaluated
  //and it happens when we set the current guess as the state changes. But as it will also be called before
  //the useEffect even when current guess == user number, it is re evaluated for the same min and max
  //boundary. So one hack is to use 1 and 100 as boundary as initial guess will be used for the first time
  //only even though function is called again and again. But the best way is to use useMemo.
  const initialGuess = useMemo(
    () => generateRandomBetween(1, 100, userNumber),
    [1, 100]
  );
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [guessRounds, setGuessRounds] = useState([initialGuess]);
  //This is called whenever it's dependency changes. Here, it is called when we receive a new user number,
  //current guess or on game over.
  useEffect(() => {
    if (currentGuess == userNumber) {
      onGameOver(guessRounds.length);
    }
  }, [currentGuess, userNumber, onGameOver]);

  //Will ran only for the first time.
  useEffect(() => {
    minBoundary = 1;
    maxBoundary = 100;
  }, []);
  const nextGuessHandler = (direction) => {
    //This condition makes sure that user plays farely i.e. if he says number should be lower
    //but actually the current guess number is already less than the user number, then, it is
    //making him to go down without any reason instead it should have selected greater.
    if (
      (direction === "lower" && currentGuess < userNumber) ||
      (direction === "greater" && currentGuess > userNumber)
    ) {
      Alert.alert("Don't lie", "You know that is wrong...", [
        { text: "Sorry!", style: "cancel" },
      ]);
      return;
    }
    //If I say phone that number you are guessing should be lower, I make sure that number that
    //he has guessed is the max boundary now and is also excluded from next random number generation,
    if (direction === "lower") {
      maxBoundary = currentGuess;
    } else {
      //If I say phone that number you are guessing should be higher, I make sure the number is
      //not included by adding 1 to it as upper boundary is excluded from the function now we need to
      //do it for the lower boundary.
      minBoundary = currentGuess + 1;
    }
    const newRndNumber = generateRandomBetween(
      minBoundary,
      maxBoundary,
      currentGuess
    );

    setCurrentGuess(newRndNumber);
    setGuessRounds((prevGuessRounds) => [newRndNumber, ...prevGuessRounds]);
  };

  const guessRoundsListLength = guessRounds.length;

  return (
    <View style={styles.screen}>
      <Title>Opponent's Guess</Title>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card>
        <InstructionText style={styles.instructionText}>
          Higher or lower?
        </InstructionText>
        <View style={styles.buttonsContainer}>
          <View style={styles.individualButtonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
              <Ionicons name="md-remove" size={24} color="white" />
            </PrimaryButton>
          </View>
          <View style={styles.individualButtonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "greater")}>
              <Ionicons name="md-add" size={24} color="white" />
            </PrimaryButton>
          </View>
        </View>
      </Card>
      <View style={styles.listContainer}>
        {/* {guessRounds.map((guessRound) => (
          <Text key={guessRound}>{guessRound}</Text>
        ))} */}
        <FlatList
          data={guessRounds}
          renderItem={(itemData) => (
            <GuessLogItem
              roundNumber={guessRoundsListLength - itemData.index}
              guess={itemData.item}
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
};
export default GameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  instructionText: {
    marginBottom: 12,
  },
  individualButtonContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
});
