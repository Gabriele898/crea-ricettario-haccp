import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SemilavoratoDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [semilavorato, setSemilavorato] = useState(null);
  const [lottiProduzione, setLottiProduzione] = useState([]);

  useEffect(() => {
    const fetchSemilavorato = async () => {
      const { data, error } = await supabase
        .from('semilavorati')
        .select(`
          *,
          ingredienti (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Errore durante il recupero del semilavorato:', error);
      } else {
        setSemilavorato(data);
      }
    };

    const fetchLottiProduzione = async () => {
      const { data, error } = await supabase
        .from('lottiproduzione')
        .select('*')
        .eq('semilavoratoid', id);

      if (error) {
        console.error('Errore durante il recupero dei lotti di produzione:', error);
      } else {
        setLottiProduzione(data);
      }
    };

    fetchSemilavorato();
    fetchLottiProduzione();
  }, [id]);

  const renderLottoItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{`Lotto ${item.id}`}</Text>
      <Button
        title="Dettagli"
        onPress={() => navigation.navigate('LottoProduzioneDetails', { id: item.id })}
      />
    </View>
  );

  const handleDelete = async () => {
    Alert.alert(
      'Conferma cancellazione',
      'Sei sicuro di voler cancellare questo semilavorato?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Cancella',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('semilavorati')
              .delete()
              .eq('id', id);

            if (error) {
              console.error('Errore durante la cancellazione del semilavorato:', error);
            } else {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {semilavorato && (
        <>
          <Text style={styles.title}>{semilavorato.nome}</Text>
          <Text style={styles.subtitle}>Ingredienti:</Text>
          <FlatList
            data={semilavorato.ingredienti}
            renderItem={({ item }) => <Text style={styles.itemText}>{item.nome}</Text>}
            keyExtractor={item => item.id.toString()}
          />
          <Text style={styles.subtitle}>Lotti di produzione:</Text>
          <FlatList
            data={lottiProduzione}
            renderItem={renderLottoItem}
            keyExtractor={item => item.id.toString()}
          />
          <Button
            title="Modifica Semilavorato"
            onPress={() => navigation.navigate('ModificaSemilavorato', { id: semilavorato.id })}
          />
          <Button
            title="Cancella Semilavorato"
            onPress={handleDelete}
          />
          <Button
            title="Crea Lotto di Produzione"
            onPress={() => navigation.navigate('CreaLottoProduzione', { semilavoratoId: id })}
          />
        </>
      )}
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
  subtitle: {
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

export default SemilavoratoDetailsScreen;