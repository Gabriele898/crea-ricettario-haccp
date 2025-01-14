import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const DettagliSemilavoratoScreen = ({ route, navigation }) => {
  const { semilavorato } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.ingredienteItem}>
      <Text style={styles.ingredienteNome}>{item.nome}</Text>
      {/* ... visualizza altri dettagli dell'ingrediente se necessario ... */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{semilavorato.nome}</Text>
      <Text style={styles.categoria}>Categoria: {semilavorato.categoria}</Text>

      <Text style={styles.ingredientiTitle}>Ingredienti:</Text>
      <FlatList
        data={semilavorato.ingredienti} 
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
      />

      <Button
        title="Crea Lotto"
        onPress={() => navigation.navigate('CreaLottoScreen', { semilavorato })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoria: {
    fontSize: 16,
    marginBottom: 20,
  },
  ingredientiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredienteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  ingredienteNome: {
    fontSize: 16,
  },
});

export default DettagliSemilavoratoScreen;