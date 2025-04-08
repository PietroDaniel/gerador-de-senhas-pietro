import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import AppLink from "../../components/appLink/AppLink";
import Button from "../../components/Button";
import { clearPasswords, getPasswords } from "../../services/password/passwordService";

export default function History({ navigation }) {
  const [senhas, setSenhas] = useState([]);

  useEffect(() => {
    const carregarSenhas = async () => {
      const historico = await getPasswords();
      setSenhas(historico);
    };

    carregarSenhas();
  }, []);

  const renderItem = ({ item, index }) => (
    <Text style={styles.senhaItem}>
      Senha {index + 1}: {item}
    </Text>
  );

  const handleClearHistory = () => {
    Alert.alert(
      "Limpar histórico",
      "Tem certeza que deseja limpar todo o histórico de senhas?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Limpar",
          onPress: async () => {
            await clearPasswords();
            setSenhas([]);
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>HISTÓRICO DE SENHAS</Text>
      <Image source={require("../../../assets/cadeado.png")} style={styles.imagem} />
      
      <View style={styles.areaSenhas}>
        {senhas.length > 0 ? (
          <FlatList
            data={senhas}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            style={styles.lista}
          />
        ) : (
          <Text style={styles.textoSenha}>Nenhuma senha gerada ainda</Text>
        )}
      </View>
      
      <View style={styles.areaBotoes}>
        {senhas.length > 0 && (
          <Button title="LIMPAR HISTÓRICO" onPress={handleClearHistory} />
        )}
        <AppLink text="Voltar" route="Home" navigation={navigation} />
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
  areaSenhas: {
    backgroundColor: "#2ECC71",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    marginBottom: 20,
  },
  lista: {
    width: "100%",
  },
  senhaItem: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    padding: 5,
  },
  textoSenha: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  areaBotoes: {
    width: "80%",
  },
}); 