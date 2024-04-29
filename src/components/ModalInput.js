// ModalInput.js
import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet } from "react-native";

const ModalInput = ({ isVisible, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Enter lecture name"
          />
          <View style={styles.buttons}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Add" onPress={handleAdd} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    margin: 20,
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
  input: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ModalInput;
