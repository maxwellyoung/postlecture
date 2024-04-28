import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import ThoughtsListScreen from "./ThoughtsListScreen";

const HomeScreen = ({ navigation }) => {
  // Get the screen width
  const screenWidth = Dimensions.get("window").width;

  // Determine if the device is considered "mobile" based on its width
  const isMobile = screenWidth <= 768;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Post Lecture</Text>
        <View
          style={[
            styles.menuContainer,
            isMobile ? styles.menuVertical : styles.menuHorizontal,
          ]}
        >
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Schedule")}
          >
            <Text style={styles.text}>{"View Schedule"}</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Thoughts")}
          >
            <Text style={styles.text}>{"Log Thoughts"}</Text>
          </Pressable>
          {/* <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Thoughts List")}
        >
          <Text style={styles.text}>{"See Thoughts"}</Text>
        </Pressable> */}
        </View>
        <View>
          <ThoughtsListScreen />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "medium",
    marginBottom: 20,
    marginTop: 20,
    fontFamily: "Pantasia-Regular",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    margin: 6, // Adjusted for spacing around buttons
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
  },
  menuContainer: {
    // General styles for the menu container
  },
  menuHorizontal: {
    flexDirection: "row", // Keep as row for non-mobile (wider screens)
  },
  menuVertical: {
    flexDirection: "column", // Change to column for mobile (narrower screens)
  },
});

export default HomeScreen;
