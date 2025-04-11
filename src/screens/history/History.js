import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppLink from "../../components/appLink/AppLink";

export default function History({ navigation }) {
  const [senhas, setSenhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar o recarregamento da tela

  const carregarSenhas = async () => {
    try {
      setLoading(true);
      
      // Tenta obter as senhas do AsyncStorage
      let senhasCarregadas = [];
      
      try {
        const value = await AsyncStorage.getItem("senhas");
        console.log("Valor bruto do AsyncStorage:", value);
        
        if (value !== null && value !== undefined) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              senhasCarregadas = parsed;
            } else {
              console.warn("Dados não são um array:", parsed);
              // Inicializar com array vazio se não for array
              await AsyncStorage.setItem("senhas", JSON.stringify([]));
            }
          } catch (parseError) {
            console.error("Erro ao fazer parse do JSON:", parseError);
            // Inicializar com array vazio se houver erro no parse
            await AsyncStorage.setItem("senhas", JSON.stringify([]));
          }
        } else {
          console.log("Nenhum valor encontrado no AsyncStorage, inicializando com array vazio");
          await AsyncStorage.setItem("senhas", JSON.stringify([]));
        }
      } catch (storageError) {
        console.error("Erro ao acessar AsyncStorage:", storageError);
      }
      
      console.log("Total de senhas carregadas:", senhasCarregadas.length);
      setSenhas(senhasCarregadas);
    } catch (error) {
      console.error("Erro geral ao carregar senhas:", error);
      setSenhas([]);
    } finally {
      setLoading(false);
    }
  };

  // Função de teste para verificar o AsyncStorage
  const testarAsyncStorage = async () => {
    try {
      console.log("=====================");
      console.log("TESTE DE ASYNC STORAGE");
      
      // 1. Tentar salvar um valor de teste
      const testValue = { teste: true, timestamp: new Date().toISOString() };
      console.log("1. Salvando valor de teste:", JSON.stringify(testValue));
      
      try {
        await AsyncStorage.setItem("teste_key", JSON.stringify(testValue));
        console.log("   ✓ Valor de teste salvo com sucesso");
      } catch (e) {
        console.error("   ✗ Erro ao salvar valor de teste:", e);
      }
      
      // 2. Tentar recuperar o valor
      try {
        const recuperado = await AsyncStorage.getItem("teste_key");
        if (recuperado) {
          console.log("2. Valor recuperado com sucesso:", recuperado);
        } else {
          console.error("   ✗ Valor não encontrado!");
        }
      } catch (e) {
        console.error("   ✗ Erro ao recuperar valor de teste:", e);
      }
      
      // 3. Tentar remover o valor
      try {
        await AsyncStorage.removeItem("teste_key");
        console.log("3. Valor removido com sucesso");
        
        // Verificar se foi removido
        const check = await AsyncStorage.getItem("teste_key");
        console.log("   Verificação após remoção:", check === null ? "✓ Removido" : "✗ Ainda existe");
      } catch (e) {
        console.error("   ✗ Erro ao remover valor de teste:", e);
      }
      
      // 4. Testar especificamente o reset das senhas
      console.log("4. Testando reset das senhas");
      
      // Verificar se há senhas
      try {
        const senhasAtuais = await AsyncStorage.getItem("senhas");
        console.log("   Senhas antes do reset:", senhasAtuais);
        
        // Tentar limpar explicitamente
        console.log("   Tentando limpar senhas com removeItem...");
        await AsyncStorage.removeItem("senhas");
        
        // Verificar se foram removidas
        const checkSenhas = await AsyncStorage.getItem("senhas");
        console.log("   Verificação após removeItem:", checkSenhas === null ? "✓ Removido" : "✗ Ainda existe");
        
        // Se ainda existir, tentar com setItem para array vazio
        if (checkSenhas !== null) {
          console.log("   Tentando limpar senhas com setItem para array vazio...");
          await AsyncStorage.setItem("senhas", JSON.stringify([]));
          
          const checkAgain = await AsyncStorage.getItem("senhas");
          console.log("   Verificação após setItem:", checkAgain === "[]" ? "✓ Array vazio" : "✗ Falhou");
        }
        
        // Recarregar as senhas para atualizar a UI
        forceUpdate();
      } catch (e) {
        console.error("   ✗ Erro ao testar reset das senhas:", e);
      }
      
      console.log("TESTE CONCLUÍDO");
      console.log("=====================");
      
      // Atualizar a interface para refletir as alterações
      forceUpdate();
      
      Alert.alert("Teste concluído", "Verifique o console para resultados detalhados");
    } catch (error) {
      console.error("Erro geral no teste:", error);
      Alert.alert("Erro", "Falha no teste do AsyncStorage");
    }
  };

  const inicializarStorage = async () => {
    try {
      console.log("Inicializando AsyncStorage...");
      
      // Verificar se o AsyncStorage está funcionando
      await AsyncStorage.setItem("_teste_inicializacao", "OK");
      const teste = await AsyncStorage.getItem("_teste_inicializacao");
      
      if (teste !== "OK") {
        console.error("AsyncStorage não está funcionando corretamente!");
        Alert.alert(
          "Erro de Armazenamento", 
          "O armazenamento do aplicativo não está funcionando corretamente. Algumas funcionalidades podem ser limitadas."
        );
        return false;
      }
      
      // Verificar se as senhas estão em um formato válido
      const senhasString = await AsyncStorage.getItem("senhas");
      
      if (senhasString) {
        try {
          const senhasParsed = JSON.parse(senhasString);
          
          // Se não for um array, reiniciar com array vazio
          if (!Array.isArray(senhasParsed)) {
            console.warn("Formato de senhas inválido, reiniciando...");
            await AsyncStorage.setItem("senhas", JSON.stringify([]));
          }
        } catch (e) {
          console.error("Erro ao analisar senhas armazenadas, reiniciando:", e);
          await AsyncStorage.setItem("senhas", JSON.stringify([]));
        }
      }
      
      console.log("Inicialização concluída com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao inicializar storage:", error);
      return false;
    }
  };
  
  // Uma função simples para forçar a atualização da UI
  const forceUpdate = () => setRefreshKey(old => old + 1);
  
  // Usar o inicializador no efeito de montagem
  useEffect(() => {
    // Apenas carregar as senhas
    carregarSenhas();
  }, [refreshKey]);

  // Recarregar senhas quando a tela receber foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("Tela History recebeu foco, recarregando senhas...");
      forceUpdate(); // Isso vai forçar a recarga do componente e chamar carregarSenhas()
    });
    
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>HISTÓRICO DE SENHAS</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#27AE60" style={styles.loader} />
      ) : (
        <FlatList
          data={senhas}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.senhaItem}>{item}</Text>}
          contentContainerStyle={{ alignItems: "center", minHeight: 100 }}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>Nenhuma senha armazenada.</Text>
          }
        />
      )}

      <View style={styles.areaBotoes}>
        {/* Removendo o botão LIMPAR */}
        
        <TouchableOpacity 
          style={styles.botaoTeste}
          onPress={testarAsyncStorage}
          activeOpacity={0.7}
        >
          <Text style={styles.textoBotao}>LIMPAR HISTÓRICO</Text>
        </TouchableOpacity>
        
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
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#27AE60",
  },
  senhaItem: {
    fontSize: 18,
    color: "#333",
    marginVertical: 4,
    padding: 5,
  },
  textoVazio: {
    fontSize: 16,
    color: "#9a9b9b",
    marginTop: 20,
  },
  areaBotoes: {
    width: '80%',
    marginTop: 20,
  },
  loader: {
    marginVertical: 20,
  },
  botaoTeste: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  textoBotao: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
}); 