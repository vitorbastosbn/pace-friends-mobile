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
import { useChallengeDetail } from '../hooks/useChallengeDetail';
import {
  hasFormErrors,
  validateRegisterActivity,
  type RegisterActivityFormErrors,
} from '../validation/challengeValidation';
import { calculateLivePace, parseDurationToSeconds } from '../mappers/challengeMapper';

interface RegisterActivityScreenProps {
  token: string;
  challengeId: string;
}

export function RegisterActivityScreen({
  token,
  challengeId,
}: RegisterActivityScreenProps) {
  const router = useRouter();
  const { registerActivity, submitState } = useChallengeDetail(token, challengeId, {
    autoLoad: false,
  });

  const [distanceKmText, setDistanceKmText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<RegisterActivityFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = submitState === 'submitting';
  const livePace = calculateLivePace(distanceKmText, durationText);

  function clearFieldError(field: keyof RegisterActivityFormErrors) {
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSave() {
    const errors = validateRegisterActivity(distanceKmText, durationText, activityDate);
    if (hasFormErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    const durationSeconds = parseDurationToSeconds(durationText);
    if (durationSeconds === null) {
      setFormErrors((prev) => ({
        ...prev,
        duration: 'Formato invalido. Use mm:ss ou hh:mm:ss.',
      }));
      return;
    }

    setSubmitError(null);
    const success = await registerActivity({
      distanceKm: parseFloat(distanceKmText),
      durationSeconds,
      activityDate,
      notes: notes.trim() || undefined,
    });

    if (success) {
      router.back();
    } else {
      setSubmitError('Nao foi possivel registrar a atividade. Tente novamente.');
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
          Registrar Atividade
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
          {/* Distance */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Distancia (km) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                formErrors.distanceKm ? styles.inputError : null,
              ]}
              value={distanceKmText}
              onChangeText={(v) => {
                setDistanceKmText(v);
                clearFieldError('distanceKm');
              }}
              placeholder="Ex: 10.5"
              placeholderTextColor="#B0BEC5"
              keyboardType="decimal-pad"
              returnKeyType="next"
              accessible
              accessibilityLabel="Distancia em quilometros"
              editable={!isSubmitting}
            />
            {formErrors.distanceKm ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.distanceKm}
              </Text>
            ) : null}
          </View>

          {/* Duration */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Tempo (mm:ss ou hh:mm:ss) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                formErrors.duration ? styles.inputError : null,
              ]}
              value={durationText}
              onChangeText={(v) => {
                setDurationText(v);
                clearFieldError('duration');
              }}
              placeholder="Ex: 55:00 ou 1:05:30"
              placeholderTextColor="#B0BEC5"
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
              accessible
              accessibilityLabel="Tempo de atividade no formato mm:ss ou hh:mm:ss"
              editable={!isSubmitting}
            />
            {formErrors.duration ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.duration}
              </Text>
            ) : null}
          </View>

          {/* Live pace display */}
          <View style={styles.paceBox}>
            <Text style={styles.paceLabel}>Pace calculado</Text>
            <Text
              style={[styles.paceValue, !livePace && styles.paceValueEmpty]}
              accessibilityLabel={
                livePace ? `Pace: ${livePace}` : 'Informe distancia e tempo para calcular o pace'
              }
            >
              {livePace ?? '---'}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Data (YYYY-MM-DD) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                formErrors.activityDate ? styles.inputError : null,
              ]}
              value={activityDate}
              onChangeText={(v) => {
                setActivityDate(v);
                clearFieldError('activityDate');
              }}
              placeholder="Ex: 2024-05-20"
              placeholderTextColor="#B0BEC5"
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
              maxLength={10}
              accessible
              accessibilityLabel="Data da atividade no formato YYYY-MM-DD"
              editable={!isSubmitting}
            />
            {formErrors.activityDate ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.activityDate}
              </Text>
            ) : null}
          </View>

          {/* Notes */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Observacoes (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Treino de intervalos no parque"
              placeholderTextColor="#B0BEC5"
              multiline
              numberOfLines={3}
              returnKeyType="done"
              maxLength={500}
              accessible
              accessibilityLabel="Observacoes opcionais sobre a atividade"
              editable={!isSubmitting}
            />
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
            accessibilityLabel="Salvar atividade"
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                accessibilityLabel="Salvando atividade"
              />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Atividade</Text>
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
  inputMultiline: {
    height: 88,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  fieldError: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  paceBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E7D32',
  },
  paceValueEmpty: {
    color: '#A5D6A7',
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
