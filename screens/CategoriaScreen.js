import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Picker } from '@react-native-picker/picker';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CategoriaScreen = ({ route, navigation }) => {
  const { nome } = route.params;
  const [semilavorati, setSemilavorati] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtro, setFiltro] = useState(null);

  useEffect(() => {
    const fetchSemilavorati = async () => {
      let query = supabase
        .from('semilavorati')
        .select('*')
        .eq('categoria', nome);

      if (searchTerm) {
        query = query.ilike('nome', `%${searchTerm}%`);
      }

      if (filtro) {
        query = query.eq('filtro', filtro);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Errore durante il recupero dei semilavorati:', error);
      } else {
        setSemilavorati(data);
      }
    };

    fetchSemilavorati();
  }, [nome, searchTerm, filtro]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.nome}</Text>
      <Button
        title="Crea Lotto" // Cambia il titolo del pulsante
        onPress={() => navigation.navigate('CreaLottoProduzione', { semilavoratoId: item.id })} // Naviga a CreaLottoProduzione e passa l'ID
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nome}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Cerca semilavorato..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Picker
        selectedValue={filtro}
        onValueChange={(itemValue) => setFiltro(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Tutti" value={null} />
        <Picker.Item label="Carne" value="carne" />
        <Picker.Item label="Pesce" value="pesce" />
      </Picker>

      <FlatList
        data={semilavorati}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default CategoriaScreen;