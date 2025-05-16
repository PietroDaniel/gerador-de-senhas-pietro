import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Logo() {
  return (
    <Image
      source={require("../../assets/cadeado.png")}
      style={styles.logo}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
    resizeMode: "contain",
  },
}); 