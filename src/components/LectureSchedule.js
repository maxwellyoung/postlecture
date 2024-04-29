import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [newLectureName, setNewLectureName] = useState("");

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

  const addLecture = async () => {
    if (newLectureName.trim() === "") {
      Alert.alert("Error", "Please enter a class name.");
      return;
    }
    const lecturesCollection = collection(db, "lectures");
    await addDoc(lecturesCollection, { name: newLectureName.trim() });
    fetchLectures();
    setNewLectureName("");
    setModalVisible(false);
    Alert.alert("Success", "Class added successfully!");
  };

  const removeLecture = async (lectureId) => {
    const lectureDoc = doc(db, "lectures", lectureId);
    await deleteDoc(lectureDoc);
    fetchLectures();
  };

  const RightActions = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.deleteBox}>
      <Ionicons name="trash-bin" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lectures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <RightActions onPress={() => removeLecture(item.id)} />
            )}
          >
            <View style={styles.lectureItem}>
              <Text style={styles.lectureText}>{item.name}</Text>
            </View>
          </Swipeable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="black" />
            <Text style={styles.addButtonText}>Add Class</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add a New Class</Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={setNewLectureName}
              value={newLectureName}
              placeholder="Enter Class Name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(!modalVisible)}
                style={styles.button}
              />
              <Button title="Add" onPress={addLecture} style={styles.button} />
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 20,
    justifyContent: "center",
  },
  lectureText: {
    fontSize: 18,
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
  },
  addButtonText: {
    marginLeft: 10,
    fontSize: 18,
    color: "black",
  },
  button: {
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalInput: {
    width: "100%",
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  
});

export default ScheduleScreen;
