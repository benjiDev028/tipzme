import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const transactions = [
  { id: '1', amount: '5.00', date: '28/03/2023 14:30', from: 'Client #1234' },
  { id: '2', amount: '2.50', date: '28/03/2023 12:15', from: 'Client #5678' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text>€{item.amount} - {item.from}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  transactionCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  }
});