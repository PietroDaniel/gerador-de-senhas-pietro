import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import AppLink from "../../components/appLink/AppLink";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { gerarSenha, savePassword } from "../../services/password/passwordService";

export default function Home({ navigation }) {
  const [password, setPassword] = useState("");

  const handleGerarSenha = () => {
    const novaSenha = gerarSenha();
    setPassword(novaSenha);
    savePassword(novaSenha);
  };

  const copiarSenha = async () => {
    if (password) {
      try {
        await Clipboard.setStringAsync(password);
        Alert.alert("Senha copiada para a área de transferência.");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível copiar a senha.");
      }
    } else {
      Alert.alert("Atenção", "Gere uma senha antes de tentar copiar.");
    }
  };

  return (
    <LinearGradient
      colors={["white", "white"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>GERADOR DE SENHA</Text>
      <Logo></Logo>

      <View style={styles.buttonsColumn}>
      <Text style={styles.passwordText}>{password || "Sua senha aparecerá aqui"}</Text>
        <Button title="GERAR" onPress={handleGerarSenha}></Button>

        <Button title="COPIAR" onPress={copiarSenha}></Button>

        <AppLink
          text="Ver histórico de senhas"
          route="History"
          navigation={navigation}
        />
      </View>
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#27AE60",
  },
  passwordText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    backgroundColor: "#2ECC71",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    textAlign: "center",
  },
  buttonsColumn: {
    alignItems: "center",
    width: "80%",
  },
}); 