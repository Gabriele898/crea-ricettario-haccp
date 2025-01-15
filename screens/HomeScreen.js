import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [lottiProduzione, setLottiProduzione] = useState([]);

  useEffect(() => {
    const fetchLottiProduzione = async () => {
      try {
        const { data, error } = await supabase
          .from('lottiproduzione')
          .select(`
            id, 
            semilavoratoid, 
            dataproduzione,
            semilavorati (nome)
          `)
          .order('dataproduzione', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Errore nel recupero dei lotti di produzione:', error);
        } else {
          setLottiProduzione(data);
        }
      } catch (error) {
        console.error('Errore generico:', error);
      }
    };

    fetchLottiProduzione();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.lottoItem}>
      <View> 
        <Text style={styles.lottoNome}>{item.semilavorati.nome}</Text> 
        <Text style={styles.lottoData}>{new Date(item.dataproduzione).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity
        style={styles.dettagliButton}
        onPress={() => navigation.navigate('LottoProduzioneDetailsScreen', { lotto: item })} 
      >
        <Text style={styles.dettagliButtonText}>Dettagli</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={lottiProduzione}
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
  lottoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  lottoNome: { 
    fontSize: 16,
    fontWeight: 'bold',
  },
  lottoData: { 
    fontSize: 14,
  },
  dettagliButton: { 
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  dettagliButtonText: {
    color: 'white',
  },
});

export default HomeScreen;