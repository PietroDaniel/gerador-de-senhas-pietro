import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import api from "../../utils/api";

interface PokemonData {
  name: string;
  abilities: Array<{
    ability: {
      name: string;
    }
  }>;
  [key: string]: any;
}

export default function TestApi() {
  const [data, setData] = useState<PokemonData | null>(null);
  
  // QUANDO PASSA O ARRAY VAZIO, EXECUTA APENAS UMA VEZ
  useEffect(() => {
    const getData = () => {
      api.get("https://pokeapi.co/api/v2/pokemon/ditto").then((response) => {
        console.log(response.data);
        setData(response.data);
      });
    };
    
    getData();
  }, []);
  
  // [] = false
  // [1] = true
  // [null] = false
  // [undefined] = false
  // [NaN] = false
  
  return (
    <View style={styles.container}>
      {!!data && (
        <>
          <Text style={styles.text}>{data.name}</Text>
          
          <View style={styles.list}>
            <Text style={styles.subtitle}>Poderes:</Text>
            <View>
              {data.abilities.map((ability) => {
                return (
                  <Text key={ability.ability.name}>{ability.ability.name}</Text>
                )
              })}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {},
  list: {},
  subtitle: {}
});
