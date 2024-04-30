import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import ThoughtsList from "../components/ThoughtsList.js"; // Adjust the import path as needed

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const ThoughtsListScreen = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    setLoading(true);
    const thoughtsCollection = collection(db, "thoughts");
    const querySnapshot = await getDocs(
      query(thoughtsCollection, orderBy("createdAt", "desc"))
    );

    const fetchedThoughts = [];

    for (const docSnapshot of querySnapshot.docs) {
      const thoughtData = docSnapshot.data();

      let lectureName = "Unassigned Class"; // Default fallback name

      if (thoughtData.lectureTag) {
        const lectureDocRef = doc(db, "lectures", thoughtData.lectureTag);
        try {
          const lectureDocSnapshot = await getDoc(lectureDocRef);
          if (lectureDocSnapshot.exists()) {
            lectureName = lectureDocSnapshot.data().name; // Assign the fetched lecture name
          } else {
            console.log(`Lecture not found for ID: ${thoughtData.lectureTag}`);
          }
        } catch (error) {
          console.error("Error fetching lecture name:", error);
        }
      }

      // Construct the thought object with all relevant data, including the dynamically fetched lecture name
      fetchedThoughts.push({
        id: docSnapshot.id,
        lectureName,
        ...thoughtData,
        createdAt: thoughtData.createdAt
          ? new Date(thoughtData.createdAt.seconds * 1000)
          : null,
      });
    }

    setThoughts(fetchedThoughts);
    setLoading(false);
  };

  const removeThought = async (thoughtId) => {
    await deleteDoc(doc(db, "thoughts", thoughtId));
    fetchThoughts(); // Refresh the thoughts list after deletion
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
      <ThoughtsList thoughts={thoughts} removeThought={removeThought} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: isLargeScreen ? 30 : 20,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    height: "100vh",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
});

export default ThoughtsListScreen;
