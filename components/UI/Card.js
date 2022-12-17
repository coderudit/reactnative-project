import { View, StyleSheet, Dimensions } from "react-native";
import Colors from "../../constants/colors";

const Card = ({ children }) => {
  return <View style={styles.card}>{children}</View>;
};

export default Card;

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginTop: deviceWidth < 380 ? 18 : 36,
    marginHorizontal: 24,
    backgroundColor: Colors.primary800, //As we have no flex 1 background color will be applied to only that area which is occupied.
    borderRadius: 8,
    elevation: 4, //Higher the elevation more the shadow. It is an android only property.
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 }, //No shadow on left or right, but pushed down by 2 pixel.
    shadowRadius: 6,
    shadowOpacity: 0.25, //Transparency
    justifyContent: "center",
    alignItems: "center", //cross-axis is left to right as by default flex direction is column and main axis is top to bottom.
  },
});
