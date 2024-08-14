import React, { useEffect, useState } from 'react';  // Importa funções essenciais do React, como useEffect e useState
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';  // Importa componentes do React Native
import axios from 'axios';  // Importa a biblioteca Axios para fazer requisições HTTP

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);  // Define um estado para armazenar a lista de Pokémon
  const [loading, setLoading] = useState(true);  // Define um estado para controlar se os dados estão carregando

  useEffect(() => {
    // Função assíncrona para buscar a lista de Pokémon
    async function fetchPokemon() {
      try {
        // Faz uma requisição GET para a API de Pokémon, limitando a 151 Pokémon
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');

        // Para cada Pokémon na lista, faz uma requisição para obter detalhes adicionais
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon) => {
            // Faz uma requisição GET para a URL de detalhes do Pokémon
            const pokemonDetails = await axios.get(pokemon.url);
            return {
              name: pokemon.name,  // Armazena o nome do Pokémon
              image: pokemonDetails.data.sprites.front_default,  // Armazena a URL da imagem do Pokémon
            };
          })
        );

        setPokemonList(pokemonData);  // Atualiza o estado com a lista de Pokémon incluindo nomes e imagens
        setLoading(false);  // Define o estado de carregamento como falso após concluir a requisição
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);  // Loga o erro no console, se ocorrer
        setLoading(false);  // Mesmo em caso de erro, desativa o indicador de carregamento
      }
    }

    fetchPokemon();  // Chama a função para buscar Pokémon quando o componente é montado
  }, []);  // O array vazio indica que o useEffect executa apenas uma vez ao montar o componente

  // Se os dados ainda estão carregando, exibe um indicador de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>  //Contêiner centralizado para o indicador de carregamento
        <ActivityIndicator size="large" color="#0000ff" />  // Mostra um spinner de carregamento
      </View>
    );
  }

  // Renderiza a lista de Pokémon usando FlatList
  return (
    // Contêiner principal da aplicação
    <View style={styles.container}>  
      <FlatList
        data={pokemonList}  // Passa a lista de Pokémon como dados para a FlatList
        keyExtractor={(item) => item.name}  // Define a chave única para cada item como o nome do Pokémon
        renderItem={({ item }) => (  // Renderiza cada item da lista
           // Contêiner para alinhar a imagem e o nome do Pokémon
           // Exibe a imagem do Pokémon
            // Exibe o nome do Pokémon
          <View style={styles.itemContainer}> 
            <Image source={{ uri: item.image }} style={styles.image} />  
            <Text style={styles.item}>{item.name}</Text> 
          </View>
        )}
      />
    </View>
  );
}

// Define estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Faz o contêiner ocupar toda a tela
    backgroundColor: '#fff',  // Define o fundo branco
    padding: 20,  // Adiciona espaçamento interno ao contêiner
  },
  itemContainer: {
    flexDirection: 'row',  // Alinha os itens em uma linha (imagem e texto lado a lado)
    alignItems: 'center',  // Centraliza os itens verticalmente
    padding: 10,  // Adiciona espaçamento interno ao contêiner do item
  },
  item: {
    fontSize: 18,  // Define o tamanho da fonte do texto
    marginLeft: 10,  // Adiciona espaçamento à esquerda do texto
  },
  image: {
    width: 50,  // Define a largura da imagem do Pokémon
    height: 50,  // Define a altura da imagem do Pokémon
  },
  loadingContainer: {
    flex: 1,  // Faz o contêiner ocupar toda a tela
    justifyContent: 'center',  // Centraliza o conteúdo horizontalmente
    alignItems: 'center',  // Centraliza o conteúdo verticalmente
  },
});
