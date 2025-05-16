import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../components/Button";
import { clearPasswords, deletePassword, getPasswords } from "../../services/password/passwordService";
import { colors, commonStyles } from "../../utils/commonStyles";

export default function History({ navigation }) {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const carregarSenhas = async () => {
    try {
      setLoading(true);
      const data = await getPasswords();
      setPasswords(data);
    } catch (error) {
      console.log('Error loading passwords:', error);
      
      // Mensagem de erro mais específica baseada no tipo de erro
      if (error.response) {
        // O servidor respondeu com um código de status fora do intervalo 2xx
        if (error.response.status === 401 || error.response.status === 403) {
          Alert.alert("Erro de autorização", "Sua sessão pode ter expirado. Faça login novamente.");
        } else if (error.response.status >= 500) {
          Alert.alert("Erro no servidor", "Não foi possível carregar as senhas. Tente novamente mais tarde.");
        } else {
          Alert.alert("Erro", "Não foi possível carregar as senhas.");
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
      } else {
        // Algo aconteceu na configuração da requisição que disparou um erro
        Alert.alert("Erro", "Não foi possível carregar as senhas.");
      }
    } finally {
      setLoading(false);
    }
  };

  const limparHistorico = () => {
    Alert.alert("Confirmação", "Deseja apagar todo o histórico de senhas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        onPress: async () => {
          try {
            await clearPasswords();
            setPasswords([]);
          } catch (error) {
            Alert.alert("Erro", "Não foi possível limpar o histórico.");
          }
        },
      },
    ]);
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPassword = async (password) => {
    try {
      await Clipboard.setStringAsync(password);
      Alert.alert("Sucesso", "Senha copiada para a área de transferência.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível copiar a senha.");
    }
  };

  const handleDeletePassword = (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir esta senha?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: async () => {
            try {
              const success = await deletePassword(id);
              if (success) {
                setPasswords(passwords.filter(item => item.id !== id));
              } else {
                Alert.alert("Erro", "Não foi possível excluir a senha.");
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a senha.");
            }
          },
          style: "destructive"
        }
      ]
    );
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

  const renderPasswordItem = ({ item }) => {
    const isPasswordVisible = visiblePasswords[item.id] || false;
    
    return (
      <View style={styles.passwordItem}>
        <View style={styles.passwordHeader}>
          <Text style={styles.passwordName}>{item.name}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={() => togglePasswordVisibility(item.id)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>
                {isPasswordVisible ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleCopyPassword(item.password)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>📋</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleDeletePassword(item.id)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.passwordValue}>
          {isPasswordVisible ? item.password : "••••••••"}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>HISTÓRICO DE SENHAS</Text>
      </View>

      <FlatList
        data={passwords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPasswordItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma senha armazenada.
            </Text>
            <Text style={styles.emptySubText}>
              Volte para a tela principal e gere uma senha.
            </Text>
          </View>
        }
      />

      <View style={styles.buttonContainer}>
        <Button 
          title="VOLTAR" 
          onPress={() => navigation.navigate("Home")} 
        />
        
        <View style={{height: 10}} />
        
        <Button 
          title="LIMPAR TUDO" 
          onPress={limparHistorico} 
          disabled={passwords.length === 0}
        />
      </View>
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 15,
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  passwordItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  passwordName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  passwordValue: {
    fontSize: 16,
    color: colors.textLight,
    backgroundColor: colors.inputBackground,
    padding: 10,
    borderRadius: 5,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
  actionButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
    paddingBottom: 10,
  },
}); 