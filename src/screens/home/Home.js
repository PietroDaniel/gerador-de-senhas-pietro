import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Button from "../../components/Button";
import AppLink from "../../components/appLink/AppLink";
import { gerarSenha, savePassword } from "../../services/password/passwordService";

export default function Home({ navigation }) {
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleGerarSenha = () => {
    const novaSenha = gerarSenha();
    setSenha(novaSenha);
    setMensagem("");
    savePassword(novaSenha);
  };

  const copiarSenha = async () => {
    if (senha) {
      try {
        await Clipboard.setStringAsync(senha);
        setMensagem("Senha copiada!");
        setTimeout(() => {
          setMensagem("");
        }, 2000);
      } catch (erro) {
        setMensagem("Erro ao copiar senha");
        setTimeout(() => {
          setMensagem("");
        }, 2000);
      }
    } else {
      setMensagem("Gere uma senha primeiro!");
      setTimeout(() => {
        setMensagem("");
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>GERADOR DE SENHA</Text>
      <Image source={require("../../../assets/cadeado.png")} style={styles.imagem} />
      <Text style={styles.textoSenha}>{senha || "Sua senha aparecerá aqui"}</Text>
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
      <View style={styles.areaBotoes}>
        <Button title="GERAR" onPress={handleGerarSenha} />
        <Button title="COPIAR" onPress={copiarSenha} />
        <AppLink text="Ver histórico de senhas" route="History" navigation={navigation} />
      </View>
      <StatusBar style="auto" />
    </View>
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
  imagem: {
    width: 160,
    height: 160,
    marginBottom: 20,
    resizeMode: "contain",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#27AE60",
  },
  textoSenha: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#2ECC71",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    textAlign: "center",
    marginBottom: 10,
  },
  areaBotoes: {
    width: "80%",
  },
  mensagem: {
    color: "#27AE60",
    fontWeight: "bold",
    marginBottom: 15,
    fontSize: 16,
  },
}); 