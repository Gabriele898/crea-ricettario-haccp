import { StyleSheet } from 'react-native';

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white', // Colore di sfondo della tab bar
    borderTopWidth: 1, // Spessore del bordo superiore
    borderTopColor: '#ccc', // Colore del bordo superiore
    height: 60, // Altezza della tab bar
    paddingHorizontal: 20, // Padding orizzontale
    paddingBottom: 10, // Padding inferiore
    paddingTop: 5, // Padding superiore
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginBottom: 5, // Spazio tra l'icona e il testo
  },
  tabLabel: {
    fontSize: 12, // Dimensione del testo
  },
});