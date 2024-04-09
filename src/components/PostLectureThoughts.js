import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const PostLectureThoughts = ({ addThought }) => {
  const [newThought, setNewThought] = useState("");

  const handleSubmit = () => {
    if (newThought.trim()) {
      addThought(newThought.trim());
      setNewThought(""); // Reset the input field after submission
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reflect on Your Lecture</Text>
      <TextInput
        style={styles.input}
        placeholder="What's your takeaway?"
        placeholderTextColor="#a9a9a9"
        multiline
        numberOfLines={4}
        value={newThought}
        onChangeText={setNewThought}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit Thought</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: width > 600 ? 24 : 20, // Responsive font size
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: width > 600 ? 18 : 16, // Responsive font size
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top", // Ensure text starts from the top
  },
  button: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: width > 600 ? 18 : 16, // Responsive font size
  },
});

export default PostLectureThoughts;
