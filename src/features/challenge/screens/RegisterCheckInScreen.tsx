import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChallengeServiceError, registerCheckIn } from '../services/challengeService';
import { calculateLivePace, parseDurationToSeconds } from '../mappers/challengeMapper';

interface RegisterCheckInScreenProps {
  token: string;
  challengeId: string;
}

interface FormErrors {
  distanceKm?: string;
  duration?: string;
  checkInDate?: string;
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((v) => v !== undefined);
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function validateForm(
  distanceKmText: string,
  durationText: string,
  checkInDate: string
): FormErrors {
  const errors: FormErrors = {};

  const km = parseFloat(distanceKmText);
  if (!distanceKmText.trim() || isNaN(km)) {
    errors.distanceKm = 'Distancia e obrigatoria.';
  } else if (km <= 0) {
    errors.distanceKm = 'Distancia deve ser maior que zero.';
  }

  if (!durationText.trim()) {
    errors.duration = 'Tempo e obrigatorio.';
  } else {
    const seconds = parseDurationToSeconds(durationText);
    if (seconds === null) {
      errors.duration = 'Formato invalido. Use mm:ss ou hh:mm:ss.';
    } else if (seconds <= 0) {
      errors.duration = 'Tempo deve ser maior que zero.';
    }
  }

  if (!checkInDate.trim()) {
    errors.checkInDate = 'Data e obrigatoria.';
  } else {
    const date = new Date(checkInDate + 'T00:00:00');
    if (isNaN(date.getTime())) {
      errors.checkInDate = 'Data invalida. Use o formato YYYY-MM-DD.';
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        errors.checkInDate = 'Data nao pode ser futura.';
      }
    }
  }

  return errors;
}

export function RegisterCheckInScreen({ token, challengeId }: RegisterCheckInScreenProps) {
  const router = useRouter();
  const [distanceKmText, setDistanceKmText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [checkInDate, setCheckInDate] = useState(todayISO());
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const livePace = calculateLivePace(distanceKmText, durationText);

  function clearFieldError(field: keyof FormErrors) {
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSave() {
    const errors = validateForm(distanceKmText, durationText, checkInDate);
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    const durationSeconds = parseDurationToSeconds(durationText);
    if (durationSeconds === null) {
      setFormErrors((prev) => ({ ...prev, duration: 'Formato invalido. Use mm:ss ou hh:mm:ss.' }));
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await registerCheckIn(token, challengeId, {
        distanceKm: parseFloat(distanceKmText),
        durationSeconds,
        checkInDate,
        notes: notes.trim() || undefined,
      });
      setSuccessMessage('Check-in registrado com sucesso!');
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      if (err instanceof ChallengeServiceError) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Nao foi possivel registrar o check-in. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.safeArea}>
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
          {successMessage ? (
            <View style={styles.successBanner} accessibilityRole="alert" accessibilityLiveRegion="polite">
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Distance */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Distancia (km) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, formErrors.distanceKm ? styles.inputError : null]}
              value={distanceKmText}
              onChangeText={(v) => {
                setDistanceKmText(v);
                clearFieldError('distanceKm');
              }}
              placeholder="Ex: 5.0"
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
              style={[styles.input, formErrors.duration ? styles.inputError : null]}
              value={durationText}
              onChangeText={(v) => {
                setDurationText(v);
                clearFieldError('duration');
              }}
              placeholder="Ex: 30:00 ou 1:05:30"
              placeholderTextColor="#B0BEC5"
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
              accessible
              accessibilityLabel="Tempo no formato mm:ss ou hh:mm:ss"
              editable={!isSubmitting}
            />
            {formErrors.duration ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.duration}
              </Text>
            ) : null}
          </View>

          {/* Live pace */}
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
              style={[styles.input, formErrors.checkInDate ? styles.inputError : null]}
              value={checkInDate}
              onChangeText={(v) => {
                setCheckInDate(v);
                clearFieldError('checkInDate');
              }}
              placeholder="Ex: 2026-05-25"
              placeholderTextColor="#B0BEC5"
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
              maxLength={10}
              accessible
              accessibilityLabel="Data do check-in no formato YYYY-MM-DD"
              editable={!isSubmitting}
            />
            {formErrors.checkInDate ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.checkInDate}
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
              placeholder="Ex: Corrida matinal no parque"
              placeholderTextColor="#B0BEC5"
              multiline
              numberOfLines={3}
              returnKeyType="done"
              maxLength={500}
              accessible
              accessibilityLabel="Observacoes opcionais sobre o check-in"
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

        <View style={styles.actionBlock}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
              pressed && !isSubmitting && styles.saveButtonPressed,
            ]}
            onPress={() => void handleSave()}
            disabled={isSubmitting}
            accessibilityLabel="Salvar check-in"
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" accessibilityLabel="Salvando check-in" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Check-in</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFF' },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  successBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  successText: { fontSize: 14, fontWeight: '700', color: '#16a766' },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  required: { color: '#D32F2F' },
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
  inputMultiline: { height: 88, paddingTop: 12, textAlignVertical: 'top' },
  inputError: { borderColor: '#D32F2F' },
  fieldError: { fontSize: 12, color: '#D32F2F', marginTop: 4 },
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
  paceValue: { fontSize: 20, fontWeight: '800', color: '#2E7D32' },
  paceValueEmpty: { color: '#A5D6A7' },
  submitError: { fontSize: 14, color: '#D32F2F', textAlign: 'center', marginTop: 8, lineHeight: 20 },
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
    backgroundColor: '#16a766',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonPressed: { backgroundColor: '#128a53' },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.25 },
});
