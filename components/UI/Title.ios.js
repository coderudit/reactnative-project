import { Text, StyleSheet, Platform } from "react-native";
import Colors from "../../constants/colors";

const Title = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 24,
    color: "white",
    textAlign: "center",
    borderWidth: 2,
    // borderWidth: Platform.select({ ios: 2, android: 0 }),
    borderColor: "white",
    padding: 12,
    maxWidth: "80%", //Max will be this.
  },
});
