import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SectionList } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DettagliLottoScreen = ({ route }) => {
  const { lotto } = route.params;
  const [responsabile, setResponsabile] = useState(null);

  useEffect(() => {
    const fetchResponsabile = async () => {
      if (lotto.responsabile) {
        const { data, error } = await supabase
          .from('responsabili')
          .select('nome')
          .eq('id', lotto.responsabile)
          .single();

        if (error) {
          console.error('Errore nel recupero del responsabile:', error);
        } else {
          setResponsabile(data);
        }
      }
    };

    fetchResponsabile();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{item.nome}:</Text>
      <Text style={styles.itemValue}>{item.valore}</Text>
    </View>
  );

  const data = [
    {
      title: 'Informazioni generali',
      data: [
        { nome: 'Data di produzione', valore: new Date(lotto.dataProduzione).toLocaleDateString() },
        { nome: 'Responsabile', valore: responsabile ? responsabile.nome : 'N/A' },
      ],
    },
    {
      title: 'Ingredienti',
      data: lotto.ingredienti.map(ingrediente => ({
        nome: ingrediente.nome,
        valore: `DDT: ${ingrediente.ddt}, Arrivo: ${ingrediente.dataArrivo}, Quantità: ${ingrediente.quantita}, Fornitore: ${ingrediente.fornitoreId}, Note: ${ingrediente.note}`,
      })),
    },
  ];

  // Funzione per la condivisione
  const handleShare = async () => {
    try {
      const shareOptions = {
        message: `Dettagli Lotto:\n\nData di produzione: ${new Date(lotto.dataProduzione).toLocaleDateString()}\nResponsabile: ${responsabile ? responsabile.nome : 'N/A'}\nIngredienti: ${lotto.ingredienti.map(i => i.nome).join(', ')}\n...`, // Aggiungi altri dettagli
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Errore durante la condivisione:', error);
      // Mostra un messaggio di errore all'utente
    }
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  );
};

// ... (Stili) ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  itemLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  itemValue: {
    flex: 1,
  },
});

export default DettagliLottoScreen;