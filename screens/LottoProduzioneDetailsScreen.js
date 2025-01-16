import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://acanrjccdzyrarquivkb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LottoProduzioneDetailsScreen = ({ route }) => {
  const { lotto } = route.params;
  const [responsabile, setResponsabile] = useState(null);

  useEffect(() => {
    const fetchResponsabile = async () => {
      try {
        if (lotto && lotto.responsabile) {
          const { data, error } = await supabase
            .from('responsabile') // Corretto il nome della tabella in "responsabili"
            .select('nome')
            .eq('id', lotto.responsabile)
            .single();
  
          if (error) {
            console.error('Errore durante il recupero del responsabile:', error);
          } else {
            setResponsabile(data.nome);
          }
        }
      } catch (error) {
        console.error('Errore nel fetchResponsabile:', error); // Aggiunto messaggio di errore più specifico
      }
    };
  
    fetchResponsabile();
  }, [lotto]);

  return (
    <View style={styles.container}>
      {lotto && (
        <>
          <Text style={styles.title}>{lotto.semilavorati.nome}</Text>
          <Text style={styles.subtitle}>ID Lotto: {lotto.id}</Text>
          <Text style={styles.subtitle}>
            Data produzione:{" "}
            {new Date(lotto.dataproduzione).toLocaleDateString()}
          </Text>
          <Text style={styles.subtitle}>
            Responsabile: {responsabile || "N/A"}
          </Text>

          {/* Sezione Ingredienti */}
          <Text style={styles.subtitle}>Ingredienti:</Text>
          {lotto.ingredienti &&
            lotto.ingredienti.map((ingrediente, index) => (
              <View key={index} style={styles.ingrediente}>
                <Text style={styles.ingredienteText}>
                  {ingrediente.nome} - {ingrediente.ddt}
                </Text>
              </View>
            ))}
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  ingrediente: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  ingredienteText: {
    fontSize: 16,
  },
});

export default LottoProduzioneDetailsScreen;