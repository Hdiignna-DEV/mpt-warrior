import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.text}>Page Not Found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  text: {
    fontSize: 18,
    color: Colors.dark.tabIconDefault,
    marginTop: 10,
  },
});
