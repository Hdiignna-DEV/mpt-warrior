import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { tradesService } from '../../services/trades';

export default function AddTradeScreen({ navigation, route }: any) {
  const [formData, setFormData] = useState({
    pair: '',
    posisi: 'BUY' as 'BUY' | 'SELL',
    hasil: 'WIN' as 'WIN' | 'LOSS',
    pip: '',
    catatan: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.pair.trim()) {
      Alert.alert('Error', 'Pair is required');
      return false;
    }
    if (!formData.pip.trim()) {
      Alert.alert('Error', 'Pips value is required');
      return false;
    }
    if (isNaN(Number(formData.pip))) {
      Alert.alert('Error', 'Pips must be a number');
      return false;
    }
    return true;
  };

  const handleCreateTrade = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await tradesService.createTrade({
        pair: formData.pair.toUpperCase(),
        posisi: formData.posisi,
        hasil: formData.hasil,
        pip: Number(formData.pip),
        tanggal: new Date().toISOString(),
        catatan: formData.catatan || undefined,
      });

      Alert.alert('Success', 'Trade added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Refresh journal screen if coming from there
            if (route.params?.refreshCallback) {
              route.params.refreshCallback();
            }
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add trade. Please try again.');
      console.error('Add trade error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Trade</Text>

      {/* Pair Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Trading Pair *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., EURUSD, GBPUSD"
          placeholderTextColor="#64748b"
          value={formData.pair}
          onChangeText={text => handleInputChange('pair', text)}
          editable={!loading}
        />
      </View>

      {/* Position Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Position *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.posisi === 'BUY' && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('posisi', 'BUY')}
            disabled={loading}
          >
            <Text
              style={[
                styles.optionButtonText,
                formData.posisi === 'BUY' && styles.optionButtonTextActive,
              ]}
            >
              BUY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.posisi === 'SELL' && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('posisi', 'SELL')}
            disabled={loading}
          >
            <Text
              style={[
                styles.optionButtonText,
                formData.posisi === 'SELL' && styles.optionButtonTextActive,
              ]}
            >
              SELL
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Result Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Result *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.winButton,
              formData.hasil === 'WIN' && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('hasil', 'WIN')}
            disabled={loading}
          >
            <Text
              style={[
                styles.optionButtonText,
                formData.hasil === 'WIN' && styles.optionButtonTextActive,
              ]}
            >
              WIN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.lossButton,
              formData.hasil === 'LOSS' && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('hasil', 'LOSS')}
            disabled={loading}
          >
            <Text
              style={[
                styles.optionButtonText,
                formData.hasil === 'LOSS' && styles.optionButtonTextActive,
              ]}
            >
              LOSS
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pips Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pips *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 50, -30"
          placeholderTextColor="#64748b"
          value={formData.pip}
          onChangeText={text => handleInputChange('pip', text)}
          keyboardType="decimal-pad"
          editable={!loading}
        />
      </View>

      {/* Notes Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add trade notes..."
          placeholderTextColor="#64748b"
          value={formData.catatan}
          onChangeText={text => handleInputChange('catatan', text)}
          multiline
          numberOfLines={4}
          editable={!loading}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleCreateTrade}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Trade</Text>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  optionButtonTextActive: {
    color: '#fff',
  },
  winButton: {},
  lossButton: {},
  submitButton: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  spacer: {
    height: 20,
  },
});
