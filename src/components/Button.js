import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    Platform
} from "react-native";

export default function Button({ title, onPress, disabled, style }) {
  const handlePress = () => {
    if (disabled) return;
    
    if (typeof onPress === 'function') {
      onPress();
    } else {
      console.warn(`Botão "${title}" pressionado, mas onPress não é uma função válida`);
    }
  };

  return (
    <View style={[styles.buttonWrapper, style]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled
        ]}
        accessibilityLabel={title}
        accessibilityRole="button"
        disabled={disabled}
      >
        <Text style={[styles.buttonText, disabled && styles.disabledText]}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: Platform.OS === 'web' ? 200 : '80%',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#27AE60",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: "#a0d8bc",
    opacity: 0.7,
  },
  disabledText: {
    color: "#f0f0f0",
  }
}); 