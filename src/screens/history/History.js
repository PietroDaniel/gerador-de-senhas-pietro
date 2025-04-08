import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import AppLink from "../../components/appLink/AppLink";
import Button from "../../components/Button";
import { getPasswords } from "../../services/password/passwordService";
import { removeStorageItem } from "../../utils/localStorage";

export default function History({ navigation }) {
  const [senhas, setSenhas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarSenhas = async () => {
    try {
      setLoading(true);
      const historico = await getPasswords();
      setSenhas(historico || []);
    } catch (error) {
      console.error("Erro ao carregar senhas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarSenhas();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    carregarSenhas();
  }, []);

  const renderItem = ({ item, index }) => (
    <Text style={styles.senhaItem}>
      Senha {index + 1}: {item}
    </Text>
  );

  const limparHistorico = () => {
    if (senhas.length === 0) return;
    
    Alert.alert(
      "Confirmação", 
      "Deseja apagar todo o histórico de senhas?", 
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              // Remover diretamente para garantir que funcione
              await removeStorageItem("senhas");
              setSenhas([]);
              Alert.alert("Sucesso", "Histórico limpo com sucesso!");
            } catch (error) {
              console.error("Erro ao limpar histórico:", error);
              Alert.alert("Erro", "Falha ao limpar o histórico.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.titulo}>HISTÓRICO DE SENHAS</Text>
        <Image source={require("../../../assets/cadeado.png")} style={styles.imagem} />
        
        <View style={styles.areaSenhas}>
          {loading ? (
            <Text style={styles.textoSenha}>Carregando...</Text>
          ) : senhas.length > 0 ? (
            <FlatList
              data={senhas}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              style={styles.lista}
              nestedScrollEnabled={true}
              maxHeight={300}
            />
          ) : (
            <Text style={styles.textoSenha}>Nenhuma senha gerada ainda</Text>
          )}
        </View>
        
        <View style={styles.areaBotoes}>
          {senhas.length > 0 && (
            <Button title="LIMPAR HISTÓRICO" onPress={limparHistorico} />
          )}
          <AppLink text="Voltar" route="Home" navigation={navigation} />
        </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    width: "100%",
    alignItems: "center",
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
    maxHeight: 300,
  },
  lista: {
    width: "100%",
    maxHeight: 250,
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
  }
}); 