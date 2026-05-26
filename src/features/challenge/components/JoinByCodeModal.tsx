import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChallengeServiceError, friendChallengeService } from '../services/challengeService';
import { colors } from '../../../theme/colors';

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
          {/* Icon header */}
          <View style={styles.iconRow}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconEmoji}>🔑</Text>
            </View>
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Entrar por codigo</Text>
            <Text selectable style={styles.subtitle}>
              Digite o codigo de 8 caracteres compartilhado pelo criador.
            </Text>
          </View>

          <TextInput
            accessibilityLabel="Codigo de convite"
            autoCapitalize="characters"
            editable={!isSubmitting}
            maxLength={8}
            onChangeText={(value) => {
              setCode(value.toUpperCase());
              setError(null);
            }}
            placeholder="________"
            placeholderTextColor={colors.outlineVariant}
            style={styles.input}
            value={code}
          />

          {error ? (
            <Text selectable accessibilityRole="alert" style={styles.error}>{error}</Text>
          ) : null}

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
                <ActivityIndicator color={colors.onPrimary} size="small" />
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
    paddingHorizontal: 20,
    backgroundColor: colors.scrim,
  },
  sheet: {
    gap: 16,
    padding: 24,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    shadowColor: colors.onSurface,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  iconRow: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: 'rgba(46, 106, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 28,
  },
  textBlock: {
    gap: 4,
    alignItems: 'center',
  },
  title: {
    color: colors.onSurface,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  input: {
    height: 64,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 6,
    textAlign: 'center',
  },
  error: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  cancelLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  confirmLabel: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.8,
  },
});
