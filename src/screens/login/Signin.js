import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../components/Button";
import { useAuth } from "../../context/authContext";
import { colors, commonStyles } from "../../utils/commonStyles";

export default function Signin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { onLogin } = useAuth();
  
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      await onLogin(email, password);
      
    } catch (err) {
      console.log('Login error:', err);
      
      if (err.response) {
        const status = err.response.status;
        
        if (status === 401) {
          setError("E-mail ou senha incorretos");
        } else if (status === 404) {
          setError("Usuário não cadastrado");
        } else if (status === 400) {
          setError("Dados inválidos. Verifique seu email e senha.");
        } else if (status === 403) {
          setError("Acesso não autorizado");
        } else if (status >= 500) {
          setError("Erro no servidor. Tente novamente mais tarde.");
        } else {
          setError("Ocorreu um erro durante o login");
        }
      } else if (err.request) {
        // O pedido foi feito mas nenhuma resposta foi recebida
        setError("Não foi possível conectar ao servidor");
      } else {
        setError("Ocorreu um erro durante o login");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = email.trim() !== "" && password.trim() !== "";
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient
          colors={colors.backgroundGradient}
          style={commonStyles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={commonStyles.card}>
            <Text style={commonStyles.title}>SIGN IN</Text>
            
            <View style={commonStyles.form}>
              <Text style={commonStyles.label}>Email</Text>
              <TextInput
                style={commonStyles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Digite seu email"
                placeholderTextColor={colors.placeholder}
              />
              
              <Text style={commonStyles.label}>Senha</Text>
              <TextInput
                style={commonStyles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Digite sua senha"
                placeholderTextColor={colors.placeholder}
              />
              
              {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
              
              <View style={commonStyles.buttonContainer}>
                <Button 
                  title="ENTRAR" 
                  onPress={handleLogin} 
                  disabled={!isFormValid || isLoading}
                />
              </View>
              
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={commonStyles.linkText}>
                  Não possui conta ainda? Crie agora.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 