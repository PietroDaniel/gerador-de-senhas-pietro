import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import { clearPasswords, getPasswords } from "../../services/password/passwordService";

export default function History({ navigation }) {
  const [passwords, setPasswords] = useState([]);

  const carregarSenhas = async () => {
    const data = await getPasswords();
    setPasswords(data);
  };

  const limparHistorico = () => {
    Alert.alert("Confirmação", "Deseja apagar todo o histórico de senhas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        onPress: async () => {
          await clearPasswords();
          setPasswords([]);
        },
      },
    ]);
  };

  useEffect(() => {
    carregarSenhas();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarSenhas();
    });
    
    return unsubscribe;
  }, [navigation]);

  return (
    <LinearGradient
      colors={["white", "white"]} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>HISTÓRICO DE SENHAS</Text>

      <FlatList
        data={passwords}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
        contentContainerStyle={{ alignItems: "center" }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma senha armazenada.</Text>
        }
      />

      <View style={{ width: '60%', paddingTop: 40 }}>
        <Button title="LIMPAR" onPress={limparHistorico} />
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#27AE60",
  },
  itemText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#9a9b9b",
    marginTop: 20,
  },
}); 