import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SenhaGerada = ({ senha }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textoSenha}>
        {senha || "Sua senha aparecerá aqui"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoSenha: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    textAlign: 'center',
  },
});

export default SenhaGerada; 