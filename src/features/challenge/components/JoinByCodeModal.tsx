import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChallengeServiceError, friendChallengeService } from '../services/challengeService';

interface JoinByCodeModalProps {
  token: string;
  visible: boolean;
  onClose: () => void;
  onJoined: () => void;
}

export function JoinByCodeModal({ token, visible, onClose, onJoined }: JoinByCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function close() {
    setCode('');
    setError(null);
    onClose();
  }

  async function join() {
    const inviteCode = code.trim().toUpperCase();
    if (!inviteCode) {
      setError('Informe o codigo de convite.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await friendChallengeService.joinByCode(token, inviteCode);
      close();
      onJoined();
    } catch (cause) {
      setError(
        cause instanceof ChallengeServiceError
          ? cause.message
          : 'Nao foi possivel entrar no desafio.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={close}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.sheet}>
          <Text style={styles.title}>Entrar por codigo</Text>
          <Text selectable style={styles.subtitle}>
            Digite o codigo compartilhado pelo criador do desafio.
          </Text>
          <TextInput
            accessibilityLabel="Codigo de convite"
            autoCapitalize="characters"
            editable={!isSubmitting}
            maxLength={8}
            onChangeText={(value) => {
              setCode(value.toUpperCase());
              setError(null);
            }}
            placeholder="ABCD1234"
            placeholderTextColor="#A5B2C1"
            style={styles.input}
            value={code}
          />
          {error ? <Text selectable accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={close}
              style={({ pressed }) => [styles.cancelButton, pressed ? styles.pressed : null]}
            >
              <Text style={styles.cancelLabel}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={() => void join()}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed ? styles.pressed : null,
                isSubmitting ? styles.disabled : null,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmLabel}>Confirmar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(12, 24, 40, 0.42)',
  },
  sheet: {
    gap: 14,
    padding: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderCurve: 'continuous',
  },
  title: {
    color: '#142337',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#63758A',
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#D7E0EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#15263B',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
  },
  error: {
    color: '#B32632',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#EEF2F7',
  },
  cancelLabel: {
    color: '#42566B',
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#1D4ED8',
  },
  confirmLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.8,
  },
});
