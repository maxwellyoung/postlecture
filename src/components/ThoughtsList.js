import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Picker,
  ScrollView
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs, getDoc, deleteDoc, doc } from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

const ThoughtsList = () => {
  const [thoughts, setThoughts] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState("all");

  useEffect(() => {
    fetchLectures();
    fetchThoughts(selectedLecture);
  }, []);

  useEffect(() => {
    fetchThoughts(selectedLecture);
  }, [selectedLecture]);

  const fetchLectures = async () => {
    const lecturesRef = collection(db, "lectures");
    const snapshot = await getDocs(lecturesRef);
    const lecturesData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    setLectures([{ id: "all", name: "All Lectures" }, ...lecturesData]);
  };

  const fetchThoughts = async (lectureId) => {
    const thoughtsRef = collection(db, "thoughts");
    const q = lectureId === "all" 
      ? thoughtsRef 
      : query(thoughtsRef, where("lectureTag", "==", lectureId));
    
    const snapshot = await getDocs(q);
    
    const fetchedThoughts = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const thought = docSnapshot.data();
        thought.id = docSnapshot.id;
        thought.createdAt = thought.createdAt
          ? moment(thought.createdAt.toDate()).format("MMM Do, YYYY")
          : "Unknown";
        
        // Check if lectureTag is present and fetch the lecture name
        if (thought.lectureTag) {
          const lectureRef = doc(db, "lectures", thought.lectureTag);
          const lectureSnap = await getDoc(lectureRef);
          thought.lectureName = lectureSnap.exists()
            ? lectureSnap.data().name
            : "Lecture not found";
        } else {
          thought.lectureName = "No Class Title";
        }
        
        return thought;
      })
    );
  
    setThoughts(fetchedThoughts);
  };
  
  

  const removeThought = async (thoughtId) => {
    await deleteDoc(doc(db, "thoughts", thoughtId));
    fetchThoughts(selectedLecture);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLecture}
        onValueChange={(itemValue, itemIndex) => setSelectedLecture(itemValue)}
        style={styles.picker}
      >
        {lectures.map((lecture) => (
          <Picker.Item key={lecture.id} label={lecture.name} value={lecture.id} />
        ))}
      </Picker>
      <ScrollView style={styles.scrollView}>
        {thoughts.map((thought) => (
          <Swipeable
            key={thought.id}
            renderRightActions={() => (
              <TouchableOpacity onPress={() => removeThought(thought.id)} style={styles.deleteBox}>
                <Ionicons name="trash-bin" size={24} color="white" />
              </TouchableOpacity>
            )}
            containerStyle={styles.swipeableContainer}
          >
            <View style={styles.thoughtItem}>
              <Text style={styles.thoughtTitle}>{thought.lectureName || "No Class Title"}</Text>
              <Text style={styles.thoughtDetail}>Purpose: {thought.purpose}</Text>
              <Text style={styles.thoughtDetail}>Key Learning: {thought.keyLearning}</Text>
              <Text style={styles.thoughtDetail}>Questions: {thought.puzzles}</Text>
              <Text style={styles.thoughtDetail}>
                Created on: {thought.createdAt}
              </Text>
            </View>
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    width: isLargeScreen ? '100%' : '100%', // Consistent width based on screen size
  },
  picker: {
    marginBottom: 20,
    width: '100%', // Full width to avoid content shifting
  },
  scrollView: {
    width: '100%', // Ensures the ScrollView doesn't change width
  },
  swipeableContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  thoughtItem: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  thoughtTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  thoughtDetail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
  },
});

export default ThoughtsList;
