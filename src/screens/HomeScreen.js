import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal
} from "react-native";
import { BlurView } from 'expo-blur';
import ThoughtsListScreen from "./ThoughtsListScreen";
import ThoughtsScreen from "./ThoughtsScreen";

const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const onChange = (result) => {
      setScreenWidth(result.window.width);
    };

    Dimensions.addEventListener("change", onChange);
    return () => Dimensions.removeEventListener("change", onChange);
  }, []);

  const isMobile = screenWidth <= 768;

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Post Lecture</Text>
          <View style={[styles.menuContainer, isMobile ? styles.menuVertical : styles.menuHorizontal]}>
            <Pressable style={styles.button} onPress={() => navigation.navigate("Schedule")}>
              <Text style={styles.text}>View Schedule</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={toggleModal}>
              <Text style={styles.text}>Log Thoughts</Text>
            </Pressable>
          </View>
          
          <ThoughtsListScreen />
        
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <BlurView style={styles.absoluteFill} intensity={30} tint="light" />
        <View style={styles.modalContainer}>
          <ThoughtsScreen onClose={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Pantasia-Regular',
    fontWeight: "600",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#000',
    marginHorizontal: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: '100%',
  },
  menuVertical: {
    flexDirection: "column",
  },
  menuHorizontal: {
    flexDirection: "row",
  },
});

export default HomeScreen;
