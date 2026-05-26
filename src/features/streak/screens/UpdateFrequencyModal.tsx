import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ProfileServiceError, updateFrequency } from '../../profile/services/profileService';
import type { UpdateFrequencyResponse } from '../../profile/types/profile.types';

interface UpdateFrequencyModalProps {
  token: string;
  visible: boolean;
  currentFrequency: number;
  onClose: () => void;
  onSaved: (response: UpdateFrequencyResponse) => void;
}

function formatNextSunday(today = new Date()): string {
  const effectiveFrom = new Date(today);
  effectiveFrom.setHours(0, 0, 0, 0);
  const daysUntilNextSunday = effectiveFrom.getDay() === 0
    ? 7
    : 7 - effectiveFrom.getDay();
  effectiveFrom.setDate(effectiveFrom.getDate() + daysUntilNextSunday);
  return effectiveFrom.toLocaleDateString('pt-BR');
}

export function UpdateFrequencyModal({
  token,
  visible,
  currentFrequency,
  onClose,
  onSaved,
}: UpdateFrequencyModalProps) {
  const [selection, setSelection] = useState(currentFrequency);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setSelection(currentFrequency);
      setError(null);
    }
  }, [currentFrequency, visible]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const response = await updateFrequency(token, selection);
      onSaved(response);
    } catch (cause) {
      setError(
        cause instanceof ProfileServiceError
          ? cause.message
          : 'Nao foi possivel alterar a frequencia.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Alterar frequencia</Text>
          <Text style={styles.description}>
            A nova meta entra em vigor a partir de {formatNextSunday()} e nao muda a semana em
            andamento.
          </Text>
          <View style={styles.options}>
            {Array.from({ length: 7 }, (_, index) => index + 1).map((frequency) => (
              <Pressable
                key={frequency}
                onPress={() => setSelection(frequency)}
                style={[
                  styles.option,
                  selection === frequency && styles.optionSelected,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: selection === frequency }}
                accessibilityLabel={`${frequency} dias por semana`}
              >
                <Text
                  style={[
                    styles.optionText,
                    selection === frequency && styles.optionTextSelected,
                  ]}
                >
                  {frequency}x
                </Text>
              </Pressable>
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.secondary} disabled={saving}>
              <Text style={styles.secondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => void handleSave()}
              style={[styles.primary, saving && styles.disabled]}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryText}>Salvar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 25, 50, 0.36)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16324F',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#607D8B',
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#0D47A1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#546E7A',
  },
  optionTextSelected: {
    color: '#0D47A1',
  },
  error: {
    color: '#C62828',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },
  secondary: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E1EA',
  },
  secondaryText: {
    color: '#546E7A',
    fontWeight: '600',
  },
  primary: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0D47A1',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});
