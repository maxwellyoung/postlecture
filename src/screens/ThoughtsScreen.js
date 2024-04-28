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
  SafeAreaView,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import firebase from 'firebase/app'; // Ensure Firebase is correctly imported

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
    const q = query(thoughtsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const fetchedThoughts = querySnapshot.docs.map(docSnapshot => {
      const thoughtData = docSnapshot.data();
      let lectureName = thoughtData.lectureTag ? "Loading..." : "Unknown Lecture";
      if (thoughtData.lectureTag) {
        const lectureDocRef = doc(db, "lectures", thoughtData.lectureTag);
        getDoc(lectureDocRef).then(lectureDocSnapshot => {
          lectureName = lectureDocSnapshot.exists() ? lectureDocSnapshot.data().name : "Lecture not found";
          // Update state with new lecture name
          setThoughts(current => current.map(t => t.id === docSnapshot.id ? { ...t, lectureName } : t));
        }).catch(error => {
          console.error("Error fetching lecture name:", error);
        });
      }
      return { id: docSnapshot.id, lectureName, ...thoughtData };
    });
    setThoughts(fetchedThoughts);
    setLoading(false);
  };

  const fetchLectures = async () => {
    const lecturesCollection = collection(db, "lectures");
    const snapshot = await getDocs(lecturesCollection);
    const fetchedLectures = snapshot.docs.map(docSnapshot => ({
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
    await addDoc(collection(db, "thoughts"), {
      purpose,
      keyLearning,
      puzzles,
      lectureTag,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Post-Lecture Reflections</Text>
        <View style={styles.card}>
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
              onValueChange={setLectureTag}
            >
              <Picker.Item label="Select a class" value="" />
              {lectures.map(lecture => (
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // A light grey background for the loading screen
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5", // A neutral off-white background
  },
  title: {
    fontSize: isLargeScreen ? 28 : 24,
    fontFamily: "Pantasia-Regular",
    fontWeight: "600",
    color: "#333", // Dark grey for better readability
    marginBottom: 30,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff", // Ensures input group has a distinct background
    padding: 10,
    borderRadius: 10, // Soft rounded corners for a modern look
  },
  inputLabel: {
    fontSize: 16,
    color: "#666", // Soft grey for text
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc", // Light grey border for subtle distinction
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#000", // Bright blue for the primary action
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text for contrast on the button
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ThoughtsScreen;
