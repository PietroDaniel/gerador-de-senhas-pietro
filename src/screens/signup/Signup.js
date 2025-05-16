import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../components/Button";
import { useAuth } from "../../context/authContext";
import { colors, commonStyles } from "../../utils/commonStyles";

export default function Signup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { onRegister } = useAuth();
  
  const validateForm = () => {
    // Validar se as senhas são iguais
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    // Validar formato da data de nascimento
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(birthdate)) {
      setError("Data de nascimento deve estar no formato DD/MM/AAAA");
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inválido");
      return false;
    }

    // Limpar erro se tudo estiver válido
    setError("");
    return true;
  };

  const handleSignup = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      
      await onRegister(name, email, password, confirmPassword, birthdate);
      
      Alert.alert(
        "Cadastro realizado",
        "Sua conta foi criada com sucesso! Faça login para continuar.",
        [{ text: "OK", onPress: () => navigation.navigate("Signin") }]
      );
      
    } catch (err) {
      console.log('Signup error:', err);
      
      if (err.message && err.message.includes("Data de nascimento inválida")) {
        setError("Data de nascimento inválida");
      } else if (err.message && err.message.includes("Formato de data inválido")) {
        setError("Formato de data inválido. Use DD/MM/AAAA");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response) {
        const status = err.response.status;
        
        if (status === 400) {
          setError("Verifique os dados informados");
        } else if (status === 409) {
          setError("Email já cadastrado");
        } else if (status >= 500) {
          setError("Erro no servidor. Tente novamente mais tarde.");
        } else {
          setError("Ocorreu um erro durante o cadastro");
        }
      } else if (err.request) {
        // O pedido foi feito mas nenhuma resposta foi recebida
        setError("Não foi possível conectar ao servidor");
      } else {
        setError("Ocorreu um erro durante o cadastro");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = 
    name.trim() !== "" && 
    email.trim() !== "" && 
    birthdate.trim() !== "" && 
    password.trim() !== "" && 
    confirmPassword.trim() !== "";
  
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
            <Text style={commonStyles.title}>SIGN UP</Text>
            
            <View style={commonStyles.form}>
              <Text style={commonStyles.label}>Nome</Text>
              <TextInput
                style={commonStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                placeholderTextColor={colors.placeholder}
              />
              
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
              
              <Text style={commonStyles.label}>Data de Nascimento</Text>
              <TextInput
                style={commonStyles.input}
                value={birthdate}
                onChangeText={setBirthdate}
                placeholder="DD/MM/AAAA"
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
              
              <Text style={commonStyles.label}>Confirmar Senha</Text>
              <TextInput
                style={commonStyles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirme sua senha"
                placeholderTextColor={colors.placeholder}
              />
              
              {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
              
              <View style={commonStyles.buttonContainer}>
                <Button 
                  title="REGISTRAR" 
                  onPress={handleSignup} 
                  disabled={!isFormValid || isLoading}
                />
              </View>
              
              <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                <Text style={commonStyles.linkText}>
                  Já possui uma conta? Faça login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 