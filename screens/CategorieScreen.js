import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const categorie = [
  { nome: 'Entre', colore: '#f0f0f0' },
  { nome: 'Antipasti Freddi', colore: '#e0e0e0' },
  { nome: 'Antipasti Caldi', colore: '#d0d0d0' },
  { nome: 'Primi Piatti', colore: '#c0c0c0' },
  { nome: 'Secondi Piatti', colore: '#b0b0b0' },
  { nome: 'Dessert', colore: '#a0a0a0' },
];

const CategorieScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoriaButton, { backgroundColor: item.colore }]}
      onPress={() => navigation.navigate('CategoriaScreen', { nome: item.nome })} 
    >
      <Text style={styles.categoriaButtonText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categorie}
        renderItem={renderItem}
        keyExtractor={(item) => item.nome}
        numColumns={2} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  categoriaButton: {
    flex: 1, 
    margin: 10,
    padding: 20,
    borderRadius: 5,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  categoriaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategorieScreen;