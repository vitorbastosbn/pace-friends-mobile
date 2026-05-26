import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useChallenges } from '../hooks/useChallenges';
import {
  hasFormErrors,
  validateCreateChallenge,
  type CreateChallengeFormErrors,
} from '../validation/challengeValidation';

interface CreateChallengeScreenProps {
  token: string;
}

export function CreateChallengeScreen({ token }: CreateChallengeScreenProps) {
  const router = useRouter();
  const { createChallenge, createState } = useChallenges(token, { autoLoad: false });

  const [title, setTitle] = useState('');
  const [goalDistanceKmText, setGoalDistanceKmText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [formErrors, setFormErrors] = useState<CreateChallengeFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = createState === 'submitting';

  function clearFieldError(field: keyof CreateChallengeFormErrors) {
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSave() {
    const errors = validateCreateChallenge(title, goalDistanceKmText, deadline);
    if (hasFormErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    setSubmitError(null);
    const success = await createChallenge({
      title: title.trim(),
      goalDistanceKm: parseFloat(goalDistanceKmText),
      deadline,
    });

    if (success) {
      router.back();
    } else {
      setSubmitError('Nao foi possivel criar o desafio. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.backText}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Novo Desafio
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Titulo <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, formErrors.title ? styles.inputError : null]}
              value={title}
              onChangeText={(v) => {
                setTitle(v);
                clearFieldError('title');
              }}
              placeholder="Ex: Correr 50km em dezembro"
              placeholderTextColor="#B0BEC5"
              returnKeyType="next"
              maxLength={100}
              accessible
              accessibilityLabel="Titulo do desafio"
              editable={!isSubmitting}
            />
            {formErrors.title ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.title}
              </Text>
            ) : null}
          </View>

          {/* Goal distance */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Meta de distancia (km) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                formErrors.goalDistanceKm ? styles.inputError : null,
              ]}
              value={goalDistanceKmText}
              onChangeText={(v) => {
                setGoalDistanceKmText(v);
                clearFieldError('goalDistanceKm');
              }}
              placeholder="Ex: 50"
              placeholderTextColor="#B0BEC5"
              keyboardType="decimal-pad"
              returnKeyType="next"
              accessible
              accessibilityLabel="Meta de distancia em quilometros"
              editable={!isSubmitting}
            />
            {formErrors.goalDistanceKm ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.goalDistanceKm}
              </Text>
            ) : null}
          </View>

          {/* Deadline */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Prazo (YYYY-MM-DD) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, formErrors.deadline ? styles.inputError : null]}
              value={deadline}
              onChangeText={(v) => {
                setDeadline(v);
                clearFieldError('deadline');
              }}
              placeholder="Ex: 2024-12-31"
              placeholderTextColor="#B0BEC5"
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              maxLength={10}
              accessible
              accessibilityLabel="Prazo do desafio no formato YYYY-MM-DD"
              editable={!isSubmitting}
            />
            {formErrors.deadline ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.deadline}
              </Text>
            ) : null}
          </View>

          {submitError ? (
            <Text
              style={styles.submitError}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              {submitError}
            </Text>
          ) : null}
        </ScrollView>

        {/* Action */}
        <View style={styles.actionBlock}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
              pressed && !isSubmitting && styles.saveButtonPressed,
            ]}
            onPress={() => void handleSave()}
            disabled={isSubmitting}
            accessibilityLabel="Salvar desafio"
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                accessibilityLabel="Salvando desafio"
              />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Desafio</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  flex: {
    flex: 1,
  },
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
  backText: {
    fontSize: 28,
    color: '#0D47A1',
    fontWeight: '400',
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    minWidth: 48,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  required: {
    color: '#D32F2F',
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#263238',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  fieldError: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  submitError: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  actionBlock: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#F8FAFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EDF5',
  },
  saveButton: {
    height: 52,
    backgroundColor: '#0D47A1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonPressed: {
    backgroundColor: '#0A3880',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.25,
  },
});
