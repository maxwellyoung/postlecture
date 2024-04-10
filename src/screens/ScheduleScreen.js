import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import LectureSchedule from "../components/LectureSchedule";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

const ScheduleScreen = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true); // Define a loading state

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    const lecturesCollection = collection(db, "lectures");
    const snapshot = await getDocs(lecturesCollection);
    const fetchedLectures = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLectures(fetchedLectures);
    setLoading(false); // Set loading to false once data is fetched
  };

  const addLecture = async (lectureName) => {
    const lecturesCollection = collection(db, "lectures");
    await addDoc(lecturesCollection, { name: lectureName });
    fetchLectures(); // Refetch the lectures list to include the new lecture
  };

  const removeLecture = async (lectureId) => {
    const lectureDoc = doc(db, "lectures", lectureId);
    await deleteDoc(lectureDoc);
    fetchLectures(); // Refetch the lectures list after removing the lecture
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LectureSchedule
        lectures={lectures}
        addLecture={addLecture}
        removeLecture={removeLecture}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ScheduleScreen;
