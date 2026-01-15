import { View, Text, StyleSheet } from 'react-native';

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Trading Journal Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
