import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
} from "react-native";

export default function Button({ title, onPress }) {
  const handlePress = () => {
    console.log(`Botão "${title}" pressionado`);
    if (typeof onPress === 'function') {
      onPress();
    } else {
      console.warn(`Botão "${title}" pressionado, mas onPress não é uma função válida`);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#27AE60",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
  },
}); 