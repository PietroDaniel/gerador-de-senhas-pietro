import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import AppLink from "../../components/appLink/AppLink";
import Button from "../../components/Button";
import { gerarSenha } from "../../services/password/passwordService";

export default function Home({ navigation }) {
  const [senha, setSenha] = useState("");

  // Função direta para salvar senha no AsyncStorage
  const salvarSenha = async (novaSenha) => {
    try {
      console.log("Tentando salvar senha:", novaSenha);
      
      // Primeiro, obter senhas existentes
      let senhas = [];
      
      try {
        const value = await AsyncStorage.getItem("senhas");
        console.log("Valor existente no AsyncStorage:", value);
        
        if (value !== null && value !== undefined) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              senhas = parsed;
              console.log("Array de senhas carregado, tamanho:", senhas.length);
            } else {
              console.warn("Valor não é um array, iniciando novo array");
            }
          } catch (e) {
            console.error("Erro ao analisar JSON, iniciando novo array:", e);
          }
        } else {
          console.log("Nenhum valor encontrado, iniciando novo array");
        }
      } catch (e) {
        console.error("Erro ao ler do AsyncStorage:", e);
      }
      
      // Adicionar a nova senha
      senhas.push(novaSenha);
      
      // Preparar string para salvar
      const stringToSave = JSON.stringify(senhas);
      console.log("Salvando novo array de senhas:", stringToSave);
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem("senhas", stringToSave);
      console.log("Senha salva com sucesso! Total agora:", senhas.length);
      
      // Verificar se foi salvo corretamente
      try {
        const verificacao = await AsyncStorage.getItem("senhas");
        console.log("Verificação após salvar:", verificacao ? "OK" : "Falha");
      } catch (e) {
        console.error("Erro ao verificar salvamento:", e);
      }
      
      return true;
    } catch (error) {
      console.error("Erro geral ao salvar senha:", error);
      return false;
    }
  };

  const handleGerarSenha = async () => {
    try {
      // Gerar a senha
      const novaSenha = gerarSenha();
      console.log("Nova senha gerada:", novaSenha);
      
      // Atualizar o estado
      setSenha(novaSenha);
      
      // Salvar no AsyncStorage
      const salvou = await salvarSenha(novaSenha);
      if (!salvou) {
        console.warn("Não foi possível salvar a senha no histórico");
      }
    } catch (error) {
      console.error("Erro ao gerar senha:", error);
      Alert.alert("Erro", "Não foi possível gerar uma nova senha.");
    }
  };

  const copiarSenha = async () => {
    if (senha) {
      try {
        await Clipboard.setStringAsync(senha);
        Alert.alert("Sucesso", "Senha copiada para a área de transferência.");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível copiar a senha.");
      }
    } else {
      Alert.alert("Atenção", "Gere uma senha antes de tentar copiar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>GERADOR DE SENHA</Text>
      <Image source={require("../../../assets/cadeado.png")} style={styles.imagem} />
      <Text style={styles.textoSenha}>{senha || "Sua senha aparecerá aqui"}</Text>

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
}); 