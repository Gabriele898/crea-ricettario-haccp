import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { SearchBar } from 'react-native-elements';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CategoriaScreen = ({ route, navigation }) => {
  const { nome } = route.params;
  const [semilavorati, setSemilavorati] = useState([]);
  const [filtroIngrediente, setFiltroIngrediente] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSemilavorati = async () => {
      try {
        const { data, error } = await supabase
          .from('semilavorati')
          .select('*')
          .eq('categoria', nome);

        if (error) {
          console.error('Errore nel recupero dei semilavorati:', error);
        } else {
          let semilavoratiFiltrati = data;

          if (filtroIngrediente) {
            semilavoratiFiltrati = semilavoratiFiltrati.filter(semilavorato => {
              return semilavorato.ingredienti.some(ingrediente => ingrediente.tipo === filtroIngrediente);
            });
          }

          // Filtro per ricerca
          if (search) {
            const searchTerm = search.toLowerCase();
            semilavoratiFiltrati = semilavoratiFiltrati.filter(semilavorato =>
              semilavorato.nome.toLowerCase().includes(searchTerm)
            );
          }

          setSemilavorati(semilavoratiFiltrati);
        }
      } catch (error) {
        console.error('Errore generico:', error);
      }
    };

    fetchSemilavorati();
  }, [nome, filtroIngrediente, search]);

  const renderItem = ({ item }) => (
    <View style={styles.semilavoratoItem}> {/* Usa View per contenere il testo e il pulsante */}
      <Text style={styles.semilavoratoButtonText}>{item.nome}</Text>
      <TouchableOpacity
        style={styles.creaLottoButton}
        onPress={() => navigation.navigate('CreaLottoScreen', { semilavorato: item })}
      >
        <Text style={styles.creaLottoButtonText}>Crea Lotto</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nome}</Text>

      {/* Filtri */}
      <View style={styles.filtri}>
        {/* ... (codice per i filtri) ... */}
      </View>

      <SearchBar
        placeholder="Cerca semilavorati..."
        onChangeText={(text) => setSearch(text)}
        value={search}
        lightTheme
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
      />

      <FlatList
        data={semilavorati}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

// ... (styles) ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  semilavoratoButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  semilavoratoButtonText: {
    fontSize: 16,
  },
  filtri: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filtro: {
    fontSize: 16,
    padding: 10,
  },
  filtroAttivo: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'blue', 
  },
});

export default CategoriaScreen;