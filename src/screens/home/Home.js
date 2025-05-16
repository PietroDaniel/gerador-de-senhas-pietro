import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppLink from "../../components/appLink/AppLink";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/authContext";
import { gerarSenha, savePassword } from "../../services/password/passwordService";
import { colors, commonStyles } from "../../utils/commonStyles";

export default function Home({ navigation }) {
  const [password, setPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState("");
  const [error, setError] = useState("");
  
  const { onLogout } = useAuth();

  const handleGerarSenha = () => {
    const novaSenha = gerarSenha();
    setPassword(novaSenha);
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
  
  const handleSavePassword = () => {
    if (!password) {
      Alert.alert("Atenção", "Gere uma senha antes de tentar salvar.");
      return;
    }
    
    // Abrir o modal para salvar a senha
    setModalVisible(true);
  };
  
  const handleSubmitSavePassword = async () => {
    try {
      setError("");
      
      if (!itemName.trim()) {
        setError("O nome do item é obrigatório");
        return;
      }
      
      // Salvar a senha no backend
      const result = await savePassword(password, itemName);
      
      // Verificar se o resultado foi bem-sucedido
      if (result) {
        // Fechar o modal e limpar os campos
        setModalVisible(false);
        setItemName("");
        
        // Navegar para a tela de histórico
        navigation.navigate("History");
      } else {
        setError("Não foi possível salvar a senha");
      }
      
    } catch (err) {
      console.log('Error saving password:', err);
      
      if (err.response) {
        const status = err.response.status;
        
        if (status === 401 || status === 403) {
          setError("Sessão expirada. Faça login novamente.");
        } else if (status === 409) {
          setError("Já existe um item com este nome");
        } else if (status === 400) {
          setError("Dados inválidos. Verifique o nome do item.");
        } else if (status >= 500) {
          setError("Erro no servidor. Tente novamente mais tarde.");
        } else {
          setError("Ocorreu um erro ao salvar a senha");
        }
      } else if (err.request) {
        // O pedido foi feito mas nenhuma resposta foi recebida
        setError("Falha na conexão com o servidor");
      } else {
        setError("Ocorreu um erro ao salvar a senha");
      }
    }
  };
  
  const handleLogout = () => {
    onLogout();
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>GERADOR DE SENHA</Text>
      <Logo />

      <View style={styles.buttonsColumn}>
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordText}>
            {password || "Gere sua senha"}
          </Text>
        </View>
        
        <View style={styles.buttonsWrapper}>
          <Button title="GERAR" onPress={handleGerarSenha} />
          
          <Button title="SALVAR" onPress={handleSavePassword} disabled={!password} />
          
          <Button title="COPIAR" onPress={copiarSenha} disabled={!password} />
        </View>

        <AppLink
          text="Ver Senhas"
          route="History"
          navigation={navigation}
        />
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      {/* Modal para salvar senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Salvar Senha</Text>
              
              <Text style={commonStyles.label}>Nome do Item</Text>
              <TextInput
                style={commonStyles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Ex: Facebook, Gmail, etc"
                placeholderTextColor={colors.placeholder}
              />
              
              <Text style={commonStyles.label}>Senha Gerada</Text>
              <Text style={styles.passwordDisplay}>{password}</Text>
              
              {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
              
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => {
                    setModalVisible(false);
                    setError("");
                    setItemName("");
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.modalButton, 
                    styles.saveButton,
                    !itemName.trim() ? styles.disabledButton : null
                  ]} 
                  onPress={handleSubmitSavePassword}
                  disabled={!itemName.trim()}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
    textAlign: "center",
  },
  buttonsColumn: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    marginTop: 20,
  },
  buttonsWrapper: {
    width: "100%",
    marginVertical: 15,
  },
  passwordContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 15,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  passwordText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  passwordDisplay: {
    fontSize: 16,
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.text,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 