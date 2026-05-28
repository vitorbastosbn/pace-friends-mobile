import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChallengeDetail } from '../hooks/useChallengeDetail';
import {
  hasFormErrors,
  validateRegisterActivity,
  type RegisterActivityFormErrors,
} from '../validation/challengeValidation';
import { calculateLivePace, parseDurationToSeconds } from '../mappers/challengeMapper';
import { notifyStreakChanged } from '../../streak/services/streakEvents';
import { getUserAchievements } from '../../achievements/services/achievementsService';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

const BANNER_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0mIsjUywDN9OhpO1WdXeSdJb3SQ7p2QVG54ZCazgf54Yo7CPjdesGjofJGYyHXnnMrgpgh-9uu7RrvTkqwtJyQDtVyp5Uw8S60l2seLAmOh7VrusmgHLO9r4iy_OTXbm2dzc5JYeU06UFcIoj3H7XUhku7yfxm3VW5KgI-fz39kiFPl0E7cDrrbLpvS7DemQyQacGZ-3qdOWYs6PU1chnhjPxilkplOkL3abA42QEsLQLJO7hK1eFFo5Uz9YDNYuKEBE2RhonptK6';

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDuration(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 6);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`;
}

function formatDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

interface RegisterActivityScreenProps {
  token: string;
  challengeId: string;
}

export function RegisterActivityScreen({ token, challengeId }: RegisterActivityScreenProps) {
  const router = useRouter();
  const { registerActivity, submitState } = useChallengeDetail(token, challengeId, {
    autoLoad: false,
  });

  const [distanceKmText, setDistanceKmText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [activityDate, setActivityDate] = useState(todayISO);
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
      setFormErrors((prev) => ({ ...prev, duration: 'Formato inválido. Use mm:ss ou hh:mm:ss.' }));
      return;
    }

    setSubmitError(null);

    let previousUnlockedIds = new Set<string>();
    try {
      const prev = await getUserAchievements(token);
      previousUnlockedIds = new Set(prev.filter((a) => a.unlocked).map((a) => a.id));
    } catch { /* ignore */ }

    const success = await registerActivity({
      distanceKm: parseFloat(distanceKmText),
      durationSeconds,
      activityDate,
      notes: notes.trim() || undefined,
    });

    if (success) {
      notifyStreakChanged();

      try {
        const updated = await getUserAchievements(token);
        const newlyUnlocked = updated.filter((a) => a.unlocked && !previousUnlockedIds.has(a.id));
        if (newlyUnlocked.length > 0) {
          const names = newlyUnlocked.map((a) => a.name).join(', ');
          Alert.alert('Conquista desbloqueada!', names, [{ text: 'Ver conquistas', style: 'default' }]);
        }
      } catch { /* ignore */ }

      router.back();
    } else {
      setSubmitError('Não foi possível registrar a atividade. Tente novamente.');
    }
  }

  return (
    <View style={styles.root}>
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
          {/* Bento stats row */}
          <View style={styles.bentoRow}>
            <View style={[styles.card, styles.flex1, formErrors.distanceKm ? styles.cardError : null]}>
              <View style={styles.cardLabelRow}>
                <MaterialIcons name="route" size={16} color={colors.onSurfaceVariant} />
                <Text style={styles.cardLabel}>Distância</Text>
              </View>
              <View style={styles.cardValueRow}>
                <TextInput
                  style={styles.cardInput}
                  value={distanceKmText}
                  onChangeText={(v) => { setDistanceKmText(v); clearFieldError('distanceKm'); }}
                  placeholder="0.00"
                  placeholderTextColor={colors.outlineVariant}
                  keyboardType="decimal-pad"
                  editable={!isSubmitting}
                  accessibilityLabel="Distância em quilômetros"
                />
                <Text style={styles.cardUnit}>km</Text>
              </View>
            </View>

            <View style={[styles.card, styles.flex1, formErrors.duration ? styles.cardError : null]}>
              <View style={styles.cardLabelRow}>
                <MaterialIcons name="timer" size={16} color={colors.onSurfaceVariant} />
                <Text style={styles.cardLabel}>Tempo</Text>
              </View>
              <TextInput
                style={styles.cardInput}
                value={durationText}
                onChangeText={(v) => { setDurationText(formatDuration(v)); clearFieldError('duration'); }}
                placeholder="00:00:00"
                placeholderTextColor={colors.outlineVariant}
                keyboardType="numbers-and-punctuation"
                editable={!isSubmitting}
                accessibilityLabel="Tempo de atividade"
              />
            </View>
          </View>

          {(formErrors.distanceKm || formErrors.duration) && (
            <View style={styles.bentoErrorRow}>
              <Text style={[styles.fieldError, styles.flex1]} accessibilityRole="alert">
                {formErrors.distanceKm ?? ''}
              </Text>
              <Text style={[styles.fieldError, styles.flex1]} accessibilityRole="alert">
                {formErrors.duration ?? ''}
              </Text>
            </View>
          )}

          {/* Pace card */}
          <View style={styles.paceCard}>
            <View style={styles.paceLeft}>
              <View style={styles.cardLabelRow}>
                <MaterialIcons name="speed" size={16} color={colors.primary} />
                <Text style={styles.paceLabelText}>Pace calculado</Text>
              </View>
              <Text
                style={[styles.paceValue, !livePace && styles.paceValueEmpty]}
                accessibilityLabel={livePace ? `Pace: ${livePace}` : 'Informe distância e tempo para calcular o pace'}
              >
                {livePace ?? '--:--/km'}
              </Text>
            </View>
            <MaterialIcons
              name="bolt"
              size={120}
              color={colors.primary}
              style={styles.paceBolt}
            />
          </View>

          {/* Date card */}
          <View style={[styles.card, formErrors.activityDate ? styles.cardError : null]}>
            <View style={styles.cardLabelRow}>
              <MaterialIcons name="calendar-today" size={16} color={colors.onSurfaceVariant} />
              <Text style={styles.cardLabel}>Data da Atividade</Text>
            </View>
            <TextInput
              style={styles.cardDateInput}
              value={activityDate}
              onChangeText={(v) => { setActivityDate(formatDate(v)); clearFieldError('activityDate'); }}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={colors.outlineVariant}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              editable={!isSubmitting}
              accessibilityLabel="Data da atividade"
            />
            {formErrors.activityDate ? (
              <Text style={styles.fieldError} accessibilityRole="alert">{formErrors.activityDate}</Text>
            ) : null}
          </View>

          {/* Notes card */}
          <View style={styles.card}>
            <View style={styles.cardLabelRow}>
              <MaterialIcons name="notes" size={16} color={colors.onSurfaceVariant} />
              <Text style={styles.cardLabel}>Observações</Text>
            </View>
            <TextInput
              style={styles.cardNotesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Como foi sua corrida hoje?"
              placeholderTextColor={colors.outlineVariant}
              multiline
              numberOfLines={3}
              maxLength={500}
              textAlignVertical="top"
              editable={!isSubmitting}
              accessibilityLabel="Observações sobre a atividade"
            />
          </View>

          {/* Motivational banner */}
          <View style={styles.banner}>
            <Image
              source={{ uri: BANNER_IMAGE_URI }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              accessibilityLabel="Corredor motivacional"
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Pronto para o próximo?</Text>
              <Text style={styles.bannerSubtitle}>Cada quilômetro conta para o seu progresso.</Text>
            </View>
          </View>

          {submitError ? (
            <Text style={styles.submitError} accessibilityRole="alert" accessibilityLiveRegion="polite">
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
            accessibilityLabel="Salvar atividade"
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} accessibilityLabel="Salvando atividade" />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Salvar Atividade</Text>
                <MaterialIcons name="check-circle" size={20} color={colors.onPrimary} />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: '#10233B',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 1,
} as const;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  // Cards
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(195, 198, 215, 0.3)',
    padding: 16,
    gap: 8,
    ...CARD_SHADOW,
  },
  cardError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLabel: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.05,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  cardInput: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 24,
    lineHeight: 32,
    padding: 0,
    flex: 1,
  },
  cardUnit: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.02,
  },
  cardDateInput: {
    color: colors.onSurface,
    fontFamily: fonts.bodyRegular,
    fontSize: 18,
    lineHeight: 28,
    padding: 0,
  },
  cardNotesInput: {
    color: colors.onSurface,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 72,
    padding: 0,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoErrorRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
    marginTop: -4,
  },
  fieldError: {
    color: colors.error,
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
  },
  // Pace card
  paceCard: {
    backgroundColor: 'rgba(219, 225, 255, 0.3)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(219, 225, 255, 0.6)',
    padding: 16,
    gap: 8,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  paceLeft: {
    gap: 4,
    zIndex: 1,
  },
  paceLabelText: {
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.05,
  },
  paceValue: {
    color: colors.primary,
    fontFamily: fonts.displayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.01 * 32,
  },
  paceValueEmpty: {
    color: colors.primaryFixedDim,
  },
  paceBolt: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.10,
  },
  // Motivational banner
  banner: {
    borderRadius: 16,
    height: 128,
    marginTop: 8,
    overflow: 'hidden',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 80, 215, 0.52)',
  },
  bannerText: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontFamily: fonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 28,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  submitError: {
    color: colors.error,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  // Action
  actionBlock: {
    backgroundColor: colors.background,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    elevation: 4,
    flexDirection: 'row',
    gap: 10,
    height: 56,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 24,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: colors.onPrimary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    letterSpacing: 0.02,
  },
});
