import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
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
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { Picker } from "@react-native-picker/picker";
import firebase from "firebase/app"; // Ensure Firebase is correctly imported

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const ThoughtsScreen = ({ onClose }) => {
  const [thoughts, setThoughts] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [keyLearning, setKeyLearning] = useState("");
  const [puzzles, setPuzzles] = useState("");
  const [lectureTag, setLectureTag] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isPurposeFocused, setPurposeFocused] = useState(false);
  const [isKeyLearningFocused, setKeyLearningFocused] = useState(false);
  const [isPuzzlesFocused, setPuzzlesFocused] = useState(false);

  useEffect(() => {
    fetchThoughts();
    fetchLectures();
  }, []);

  const renderInputAccessory = (isFocused, value) => {
    if (isFocused) {
      return (
        <View style={styles.inputAccessory}>
          {isFocused && <ActivityIndicator size="small" color="#000" />}
          {!isFocused && value && (
            <MaterialIcons name="check-circle" size={24} color="green" />
          )}
        </View>
      );
    }
    if (value) {
      return (
        <View style={styles.inputAccessory}>
          {isFocused && <ActivityIndicator size="small" color="#000" />}
          {!isFocused && value && (
            <MaterialIcons name="check-circle" size={24} color="green" />
          )}
        </View>
      );
    }
    return null;
  };

  const fetchThoughts = async () => {
    setLoading(true);
    const thoughtsCollection = collection(db, "thoughts");
    const q = query(thoughtsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const fetchedThoughts = querySnapshot.docs.map((docSnapshot) => {
      const thoughtData = docSnapshot.data();
      let lectureName = thoughtData.lectureTag
        ? "Loading..."
        : "Unknown Lecture";
      if (thoughtData.lectureTag) {
        const lectureDocRef = doc(db, "lectures", thoughtData.lectureTag);
        getDoc(lectureDocRef)
          .then((lectureDocSnapshot) => {
            lectureName = lectureDocSnapshot.exists()
              ? lectureDocSnapshot.data().name
              : "Lecture not found";
            // Update state with new lecture name
            setThoughts((current) =>
              current.map((t) =>
                t.id === docSnapshot.id ? { ...t, lectureName } : t
              )
            );
          })
          .catch((error) => {
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
    const newThought = {
      purpose,
      keyLearning,
      puzzles,
      lectureTag,
      createdAt: serverTimestamp(), // Use Firestore server timestamp for consistency
    };

    try {
      const docRef = await addDoc(collection(db, "thoughts"), newThought);
      // If you want to immediately show the new thought in the list:
      const newThoughtWithId = {
        id: docRef.id,
        ...newThought,
        createdAt: new Date(), // Temporary timestamp until refreshed from server
      };

      // Optimistically update the list to show the new thought
      setThoughts((currentThoughts) => [newThoughtWithId, ...currentThoughts]);

      // Optionally, clear the form here if successful
      setPurpose("");
      setKeyLearning("");
      setPuzzles("");
      setLectureTag("");
    } catch (error) {
      console.error("Error adding thought:", error);
      alert("Failed to add thought");
    }
  };

  const handlePressSubmit = () => {
    addThought();
    onClose();
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
        <Text style={styles.title}>Post Lecture Reflections</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Purpose of the lecture:</Text>
              {renderInputAccessory(isPurposeFocused, purpose)}
            </View>
            <TextInput
              style={styles.input}
              placeholder="What was the goal?"
              value={purpose}
              onChangeText={setPurpose}
              onFocus={() => setPurposeFocused(true)}
              onBlur={() => setPurposeFocused(false)}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Key learning:</Text>
              {renderInputAccessory(isKeyLearningFocused, keyLearning)}
            </View>
            <TextInput
              style={styles.input}
              placeholder="What did you learn?"
              value={keyLearning}
              onChangeText={setKeyLearning}
              onFocus={() => setKeyLearningFocused(true)}
              onBlur={() => setKeyLearningFocused(false)}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Any puzzles or questions?</Text>
              {renderInputAccessory(isPuzzlesFocused, puzzles)}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Any unanswered questions?"
              value={puzzles}
              onChangeText={setPuzzles}
              onFocus={() => setPuzzlesFocused(true)}
              onBlur={() => setPuzzlesFocused(false)}
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
              {lectures.map((lecture) => (
                <Picker.Item
                  key={lecture.id}
                  label={lecture.name}
                  value={lecture.id}
                />
              ))}
            </Picker>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePressSubmit}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Submit Reflection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#f8f9fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f8f9fa", // A light grey background for the loading screen
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    // backgroundColor: "#f5f5f5", // A neutral off-white background
  },
  title: {
    fontFamily: "Pantasia-Regular",
    fontSize: isLargeScreen ? 28 : 24,
    fontWeight: "600",
    color: "#000", // Solid black for title
    marginBottom: 20,
    textAlign: "center", // Center align for modal titles
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#fff", // Ensures input group has a distinct background
    padding: 10,
    borderRadius: 10, // Soft rounded corners for a modern look
  },
  inputLabel: {
    fontSize: 18,
    color: "#000", // Soft grey for text
    marginBottom: 5,
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f7f7f7", // Very light grey for input background
    borderWidth: 0, // No borders
    borderRadius: 8,
    padding: 15,
    // width: "100%",
    fontSize: 16,
    color: "#333", // Dark text for contrast
    shadowColor: "rgba(0,0,0,0.1)", // Subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2, // Elevation for Android
  },
  inputAccessory: {
    marginLeft: 10, // Space between input and accessory
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center buttons horizontally
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    // Stylish and minimalist button
    backgroundColor: "#000", // Vercel-like black button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    flexGrow: 1, // Buttons take up the available space evenly
    // Subtle shadow for depth
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2, // Elevation for Android
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500", // Not too bold, keeping it clean
  },
  closeButton: {
    // Close button matches the submit but with a different color
    backgroundColor: "#e0e0e0", // Light grey for contrast
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    flexGrow: 1,
    // The rest of the style is similar to the submit button
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
  },
  closeButtonText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ThoughtsScreen;
