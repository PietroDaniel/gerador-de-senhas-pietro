import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const BotaoAcao = ({ onPress, texto, tipo, desabilitado = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.botao,
        tipo === 'gerar' ? styles.botaoGerar : styles.botaoCopiar,
        desabilitado && { opacity: 0.5 }
      ]}
      onPress={onPress}
      disabled={desabilitado}
    >
      <Text style={styles.textoBotao}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  botaoGerar: {
    backgroundColor: '#27AE60',
  },
  botaoCopiar: {
    backgroundColor: '#2ECC71',
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BotaoAcao; 