import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Cabecalho = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>GERADOR DE SENHA</Text>
      <Image source={require('../assets/cadeado.png')} style={styles.imagem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#27AE60',
  },
  imagem: {
    width: 160,
    height: 160,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

export default Cabecalho; 