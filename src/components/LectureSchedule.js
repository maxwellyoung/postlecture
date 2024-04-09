import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, Alert } from "react-native";
import { db } from "../../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const ScheduleScreen = () => {
  const [lectures, setLectures] = useState([]);

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
  };

  const removeLecture = async (lectureId) => {
    const lectureDoc = doc(db, "lectures", lectureId);
    await deleteDoc(lectureDoc);
    fetchLectures(); // Refresh the list
  };

  const RightActions = ({ progress, dragX, onPress }) => (
    <View style={styles.deleteBox}>
      <Ionicons name="trash-bin" size={24} color="white" onPress={onPress} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lectures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) => (
              <RightActions
                progress={progress}
                dragX={dragX}
                onPress={() => {
                  removeLecture(item.id);
                  Alert.alert(
                    "Lecture Removed",
                    `${item.name} has been removed.`,
                  );
                }}
              />
            )}
          >
            <View style={styles.lectureItem}>
              <Text
                style={styles.lectureText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </View>
          </Swipeable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lectureItem: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "center",
  },
  lectureText: {
    fontSize: 18,
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    paddingRight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
  },
});

export default ScheduleScreen;
