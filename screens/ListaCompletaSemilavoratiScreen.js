import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ListaCompletaSemilavoratiScreen = ({ navigation }) => {
  const [semilavorati, setSemilavorati] = useState([]);

  useEffect(() => {
    const fetchSemilavorati = async () => {
      try {
        const { data, error } = await supabase
          .from('semilavorati')
          .select('*');

        if (error) {
          console.error('Errore nel recupero dei semilavorati:', error);
        } else {
          setSemilavorati(data);
        }
      } catch (error) {
        console.error('Errore generico:', error);
      }
    };

    fetchSemilavorati();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.semilavoratoButton}
      onPress={() => navigation.navigate('DettagliSemilavoratoScreen', { semilavorato: item })} 
    >
      <Text style={styles.semilavoratoButtonText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={semilavorati}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default ListaCompletaSemilavoratiScreen;