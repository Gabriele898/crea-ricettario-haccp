import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Text,
  Alert,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import { Picker } from "@react-native-picker/picker";

const supabaseUrl = "https://acanrjccdzyrarquivkb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreaSemilavoratoScreen = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [nuovoIngrediente, setNuovoIngrediente] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ingredienti, setIngredienti] = useState([]);

  // Definisci le categorie
  const categorie = [
    { nome: "Entre" },
    { nome: "Antipasti" },
    // ... altre categorie ...
  ];

  const handleAggiungiIngrediente = () => {
    if (nuovoIngrediente) {
      // Genera un ID univoco per il nuovo ingrediente (lato client)
      const nuovoId = Math.random().toString(36).substring(2, 15);
      setIngredienti([...ingredienti, { id: nuovoId, nome: nuovoIngrediente }]);
      setNuovoIngrediente("");
    }
  };

  const handleRimuoviIngrediente = (id) => {
    setIngredienti(ingredienti.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    // Validazione
    if (!nome || !categoria || ingredienti.length === 0) {
      Alert.alert("Errore", "Per favore, compila tutti i campi.");
      return;
    }

    try {
      // 1. Inserisci il semilavorato nella tabella 'semilavorati'
      const { data: semilavoratoData, error: semilavoratoError } =
        await supabase
          .from("semilavorati")
          .insert({ nome, categoria })
          .select()
          .single();

      if (semilavoratoError) {
        console.error(
          "Errore durante la creazione del semilavorato:",
          semilavoratoError
        );
        Alert.alert(
          "Errore",
          "Si è verificato un errore durante la creazione del semilavorato."
        );
        return;
      }

      // 2. Inserisci gli ingredienti nella tabella 'ingredienti' (se non esistono già)
      const ingredientiDaInserire = ingredienti.map((i) => ({ nome: i.nome }));
      const { data: ingredientiData, error: ingredientiError } = await supabase
        .from("ingredienti")
        .insert(ingredientiDaInserire)
        .select();

      if (ingredientiError) {
        console.error(
          "Errore durante l'inserimento degli ingredienti:",
          ingredientiError
        );
        Alert.alert(
          "Errore",
          "Si è verificato un errore durante l'inserimento degli ingredienti."
        );
        return;
      }

      // 3. Crea le relazioni nella tabella 'semilavorato'
      const relazioni = ingredientiData.map((ingrediente) => ({
        semilavorato_id: semilavoratoData.id,
        ingrediente_id: ingrediente.id,
      }));

      const { error: relazioniError } = await supabase
        .from("semilavorato") // Nome corretto della tabella
        .insert(relazioni);

      if (relazioniError) {
        console.error(
          "Errore durante la creazione delle relazioni:",
          relazioniError
        );
        Alert.alert(
          "Errore",
          "Si è verificato un errore durante la creazione delle relazioni."
        );
        return;
      }

      // Mostra un messaggio di successo e torna alla schermata precedente
      Alert.alert("Successo", "Semilavorato creato con successo!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Errore generico:", error);
      Alert.alert("Errore", "Si è verificato un errore.");
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

      {/* Picker per la categoria */}
      <Picker
        style={styles.picker}
        selectedValue={categoria}
        onValueChange={(itemValue) => {
          setCategoria(itemValue);
        }}
      >
        <Picker.Item label="Seleziona una categoria" value="" />
        {categorie.map((cat) => (
          <Picker.Item key={cat.nome} label={cat.nome} value={cat.nome} />
        ))}
      </Picker>

      {/* Input per il nuovo ingrediente */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nuovo ingrediente"
          value={nuovoIngrediente}
          onChangeText={setNuovoIngrediente}
        />
        <Button title="Aggiungi" onPress={handleAggiungiIngrediente} />
      </View>

      {/* Lista degli ingredienti */}
      <FlatList
        data={ingredienti}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <Button
              title="Rimuovi"
              onPress={() => handleRimuoviIngrediente(item.id)}
            />
          </View>
        )}
      />

      <Button title="Crea" onPress={handleSubmit} />
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
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default CreaSemilavoratoScreen;