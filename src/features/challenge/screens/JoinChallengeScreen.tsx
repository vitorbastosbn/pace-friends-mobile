import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFriendChallenges } from '../hooks/useFriendChallenges';

interface JoinChallengeScreenProps {
  token: string;
}

export function JoinChallengeScreen({ token }: JoinChallengeScreenProps) {
  const router = useRouter();
  const { join, joinState, joinError } = useFriendChallenges(token);

  const [inviteCode, setInviteCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const isSubmitting = joinState === 'submitting';

  async function handleJoin() {
    setCodeError('');
    const trimmed = inviteCode.trim().toUpperCase();
    if (!trimmed) {
      setCodeError('Informe o codigo do desafio.');
      return;
    }

    const result = await join(trimmed);
    if (result) {
      Alert.alert(
        'Voce entrou no desafio!',
        result.title,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
    // joinError is shown via joinError state below
  }

  const displayError = codeError || joinError || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.backText}>{'<'}</Text>
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Entrar em Desafio
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.instructions}>
            Digite o codigo de 8 caracteres compartilhado pelo criador do desafio.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Codigo do desafio</Text>
            <TextInput
              style={[styles.codeInput, displayError ? styles.inputError : null]}
              value={inviteCode}
              onChangeText={(v) => {
                setInviteCode(v.toUpperCase());
                setCodeError('');
              }}
              placeholder="Ex: ABCD1234"
              placeholderTextColor="#B0BEC5"
              autoCapitalize="characters"
              maxLength={8}
              editable={!isSubmitting}
              accessibilityLabel="Codigo do desafio"
              returnKeyType="done"
              onSubmitEditing={() => void handleJoin()}
            />
            {!!displayError && (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {displayError}
              </Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.joinButton,
              isSubmitting && styles.joinButtonDisabled,
              pressed && !isSubmitting && styles.joinButtonPressed,
            ]}
            onPress={() => void handleJoin()}
            disabled={isSubmitting}
            accessibilityLabel="Entrar no desafio"
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.joinButtonText}>Entrar</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFF' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF5',
    backgroundColor: '#F8FAFF',
  },
  backButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backText: { fontSize: 22, color: '#0D47A1', fontWeight: '600' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#0D47A1',
  },
  headerSpacer: { minWidth: 48 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  instructions: {
    fontSize: 14,
    color: '#546E7A',
    lineHeight: 22,
    marginBottom: 28,
    textAlign: 'center',
  },
  fieldGroup: { marginBottom: 24 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  codeInput: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    paddingHorizontal: 14,
    fontSize: 20,
    fontWeight: '800',
    color: '#263238',
    letterSpacing: 4,
    textAlign: 'center',
  },
  inputError: { borderColor: '#D32F2F' },
  fieldError: { fontSize: 12, color: '#D32F2F', marginTop: 4, textAlign: 'center' },
  joinButton: {
    height: 52,
    backgroundColor: '#3a73ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonDisabled: { opacity: 0.5 },
  joinButtonPressed: { backgroundColor: '#2a60e0' },
  joinButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.25 },
});
