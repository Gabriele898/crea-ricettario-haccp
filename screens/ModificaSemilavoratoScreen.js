import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ModificaSemilavoratoScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [nome, setNome] = useState('');
  const [ingredientiSelezionati, setIngredientiSelezionati] = useState([]);
  const [ingredienti, setIngredienti] = useState([]);

  useEffect(() => {
    const fetchSemilavorato = async () => {
      const { data, error } = await supabase
        .from('semilavorati')
        .select(`nome, ingredienti`)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Errore durante il recupero del semilavorato:', error);
      } else {
        setNome(data.nome);
        setIngredientiSelezionati(data.ingredienti || []);
      }
    };

    const fetchIngredienti = async () => {
      const { data, error } = await supabase
        .from('ingredienti')
        .select('*');

      if (error) {
        console.error('Errore durante il recupero degli ingredienti:', error);
      } else {
        setIngredienti(data);
      }
    };

    fetchSemilavorato();
    fetchIngredienti();
  }, [id]);

  const handleAggiungiIngrediente = (ingrediente) => {
    setIngredientiSelezionati([...ingredientiSelezionati, ingrediente.id]);
  };

  const handleRimuoviIngrediente = (ingrediente) => {
    setIngredientiSelezionati(ingredientiSelezionati.filter(item => item !== ingrediente.id));
  };

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('semilavorati')
      .update({ nome, ingredienti: ingredientiSelezionati })
      .eq('id', id);

    if (error) {
      console.error('Errore durante la modifica del semilavorato:', error);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <Text style={styles.title}>Ingredienti selezionati:</Text>
      <FlatList
        data={ingredientiSelezionati}
        renderItem={({ item }) => {
          const ingrediente = ingredienti.find(i => i.id === item);
          return (
            <View style={styles.item}>
              {ingrediente ? (
                <>
                  <Text style={styles.itemText}>{ingrediente.nome}</Text>
                  <Button title="Rimuovi" onPress={() => handleRimuoviIngrediente(ingrediente)} />
                </>
              ) : null}
            </View>
          );
        }}
        keyExtractor={item => item.toString()}
      />
      <Text style={styles.title}>Aggiungi ingredienti:</Text>
      <FlatList
        data={ingredienti.filter(i => !ingredientiSelezionati.includes(i.id))}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <Button title="Aggiungi" onPress={() => handleAggiungiIngrediente(item)} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <Button title="Salva" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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

export default ModificaSemilavoratoScreen;
