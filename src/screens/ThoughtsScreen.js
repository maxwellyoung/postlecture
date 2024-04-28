import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const ThoughtsScreen = () => {
  const [thoughts, setThoughts] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [keyLearning, setKeyLearning] = useState("");
  const [puzzles, setPuzzles] = useState("");
  const [lectureTag, setLectureTag] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThoughts();
    fetchLectures();
  }, []);

  const fetchThoughts = async () => {
    setLoading(true);
    const thoughtsCollection = collection(db, "thoughts");
    const snapshot = await getDocs(thoughtsCollection);
    const fetchedThoughts = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const thoughtData = docSnapshot.data();

        let lectureName = "Unknown Lecture"; // Default value
        if (thoughtData.lectureTag) {
          // Check if lectureTag is present
          try {
            const lectureDocRef = doc(db, "lectures", thoughtData.lectureTag);
            const lectureDocSnapshot = await getDoc(lectureDocRef);
            if (lectureDocSnapshot.exists()) {
              lectureName = lectureDocSnapshot.data().name;
            }
          } catch (error) {
            console.error("Error fetching lecture name:", error);
            // Handle any errors (e.g., invalid lectureTag) here
          }
        }

        return {
          id: docSnapshot.id,
          lectureName, // Use this directly instead of className to align with ThoughtsScreen
          ...thoughtData,
        };
      }),
    );
    setThoughts(fetchedThoughts);
    setLoading(false);
  };

  const fetchLectures = async () => {
    const lecturesCollection = collection(db, "lectures");
    const snapshot = await getDocs(lecturesCollection);
    const fetchedLectures = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      name: docSnapshot.data().name,
    }));
    setLectures(fetchedLectures);
  };

  const addThought = async () => {
    if (!purpose || !keyLearning || !puzzles || !lectureTag) {
      alert("Please fill in all fields");
      return;
    }

    const thoughtsCollection = collection(db, "thoughts");
    await addDoc(thoughtsCollection, {
      purpose,
      keyLearning,
      puzzles,
      lectureTag,
    });
    fetchThoughts(); // Refresh the thoughts list
    setPurpose("");
    setKeyLearning("");
    setPuzzles("");
    setLectureTag("");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post-Lecture Reflections</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Purpose of the lecture:</Text>
        <TextInput
          style={styles.input}
          placeholder="What was the goal?"
          value={purpose}
          onChangeText={setPurpose}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Key learning:</Text>
        <TextInput
          style={styles.input}
          placeholder="What did you learn?"
          value={keyLearning}
          onChangeText={setKeyLearning}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Any puzzles or questions?</Text>
        <TextInput
          style={styles.input}
          placeholder="Any unanswered questions?"
          value={puzzles}
          onChangeText={setPuzzles}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Related class:</Text>
        <Picker
          selectedValue={lectureTag}
          style={styles.picker}
          onValueChange={(itemValue) => setLectureTag(itemValue)}
        >
          <Picker.Item label="Select a class" value="" />
          {lectures.map((lecture) => (
            <Picker.Item
              key={lecture.id}
              label={lecture.name}
              value={lecture.id}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity onPress={addThought} style={styles.button}>
        <Text style={styles.buttonText}>Submit Reflection</Text>
      </TouchableOpacity>

      {/* {thoughts.map((thought) => (
        <View key={thought.id} style={styles.thoughtItem}>
          <Text style={styles.thoughtText}>Purpose: {thought.purpose}</Text>
          <Text style={styles.thoughtText}>
            Key Learning: {thought.keyLearning}
          </Text>
          <Text style={styles.thoughtText}>Puzzles: {thought.puzzles}</Text>
          <Text style={styles.thoughtText}>Class: {thought.lectureName}</Text>
        </View>
      ))} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: isLargeScreen ? 28 : 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 30,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  thoughtItem: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 20,
  },
  thoughtText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ThoughtsScreen;
