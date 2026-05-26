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
import { colors } from '../../../theme/colors';

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
          {/* Form intro */}
          <View style={styles.formIntro}>
            <Text style={styles.formTitle}>Personalize sua meta</Text>
            <Text style={styles.formSubtitle}>
              Defina um objetivo claro para manter sua motivacao em alta.
            </Text>
          </View>

          {/* Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Titulo do Desafio <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, formErrors.title ? styles.inputError : null]}
              value={title}
              onChangeText={(v) => {
                setTitle(v);
                clearFieldError('title');
              }}
              placeholder="Ex: Correr 50 km em junho"
              placeholderTextColor={colors.outline}
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
              Meta de Distancia (km) <Text style={styles.required}>*</Text>
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
              placeholderTextColor={colors.outline}
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
              Prazo Final (YYYY-MM-DD) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, formErrors.deadline ? styles.inputError : null]}
              value={deadline}
              onChangeText={(v) => {
                setDeadline(v);
                clearFieldError('deadline');
              }}
              placeholder="Ex: 2024-12-31"
              placeholderTextColor={colors.outline}
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
                color={colors.onPrimary}
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
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '400',
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 24,
  },
  formIntro: {
    gap: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 32,
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.02,
    paddingHorizontal: 4,
  },
  required: {
    color: colors.error,
  },
  input: {
    height: 56,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.onSurface,
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 2,
  },
  submitError: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionBlock: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  saveButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
    letterSpacing: 0.02,
  },
});
