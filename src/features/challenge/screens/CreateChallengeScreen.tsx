import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChallenges } from '../hooks/useChallenges';
import {
  hasFormErrors,
  validateCreateChallenge,
  type CreateChallengeFormErrors,
} from '../validation/challengeValidation';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/typography';

const HERO_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgbv8a7WJRPurZR16x8BEud2SgKcCgoxnnypusWPBQmtxj2Ciii9dlRCJeVDNY9MDAD4RuDJWFwJP_o6F5ZauhwxTaxcTxh3RLrZSjYPp9goAupQzZWK92taMabxGUPBKzL_lU_vSDlWesV4PFofStPiK_8R6LsHo7JjOkllusUla9Mapx6RfHhv3AJTLanolaIpWGHT1rVa-lmEZfC1Dep8kicERW0iwPSc5Sq5k3soJ5AJGB7ygp4jBawDgrSNGOtyjETe386-x6';

function formatDeadline(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

interface CreateChallengeScreenProps {
  token: string;
}

export function CreateChallengeScreen({ token }: CreateChallengeScreenProps) {
  const router = useRouter();
  const { createChallenge, createState } = useChallenges(token, { autoLoad: false });

  const [title, setTitle] = useState('');
  const [goalDistanceKmText, setGoalDistanceKmText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isPublic, setIsPublic] = useState(true);
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
      setSubmitError('Não foi possível criar o desafio. Tente novamente.');
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
          <Image
            source={{ uri: HERO_IMAGE_URI }}
            style={styles.hero}
            resizeMode="cover"
            accessibilityLabel="Corredor em pista ao amanhecer"
          />

          <View style={styles.intro}>
            <Text style={styles.introTitle}>Personalize sua meta</Text>
            <Text style={styles.introSubtitle}>
              Defina um objetivo claro para manter sua motivação em alta.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Título do Desafio</Text>
            <TextInput
              style={[styles.input, formErrors.title ? styles.inputError : null]}
              value={title}
              onChangeText={(v) => { setTitle(v); clearFieldError('title'); }}
              placeholder="Ex: Correr 50 km em junho"
              placeholderTextColor={colors.outline}
              returnKeyType="next"
              maxLength={100}
              editable={!isSubmitting}
              accessibilityLabel="Título do desafio"
            />
            {formErrors.title ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.title}
              </Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Meta de Distância</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputWithAdornment,
                  formErrors.goalDistanceKm ? styles.inputError : null,
                ]}
                value={goalDistanceKmText}
                onChangeText={(v) => { setGoalDistanceKmText(v); clearFieldError('goalDistanceKm'); }}
                placeholder="0.0"
                placeholderTextColor={colors.outline}
                keyboardType="decimal-pad"
                editable={!isSubmitting}
                accessibilityLabel="Meta de distância em quilômetros"
              />
              <View style={styles.adornmentEnd} pointerEvents="none">
                <Text style={styles.suffixText}>KM</Text>
              </View>
            </View>
            {formErrors.goalDistanceKm ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.goalDistanceKm}
              </Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Prazo Final</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputWithAdornment,
                  formErrors.deadline ? styles.inputError : null,
                ]}
                value={deadline}
                onChangeText={(v) => { setDeadline(formatDeadline(v)); clearFieldError('deadline'); }}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colors.outline}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                editable={!isSubmitting}
                accessibilityLabel="Prazo final do desafio"
              />
              <View style={styles.adornmentEnd} pointerEvents="none">
                <MaterialIcons name="calendar-today" size={18} color={colors.outline} />
              </View>
            </View>
            {formErrors.deadline ? (
              <Text style={styles.fieldError} accessibilityRole="alert">
                {formErrors.deadline}
              </Text>
            ) : null}
          </View>

          <Pressable
            style={styles.toggleRow}
            onPress={() => !isSubmitting && setIsPublic((v) => !v)}
            accessibilityRole="switch"
            accessibilityState={{ checked: isPublic }}
            accessibilityLabel="Desafio público"
          >
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIconBox}>
                <MaterialIcons name="public" size={22} color={colors.secondary} />
              </View>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>Desafio Público</Text>
                <Text style={styles.toggleSubtitle}>Amigos podem ver seu progresso</Text>
              </View>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: colors.outlineVariant, true: colors.primary }}
              thumbColor={colors.onPrimary}
              disabled={isSubmitting}
            />
          </Pressable>

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
            accessibilityLabel="Salvar desafio"
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} accessibilityLabel="Salvando desafio" />
            ) : (
              <>
                <MaterialIcons name="check-circle" size={20} color={colors.onPrimary} />
                <Text style={styles.saveButtonText}>Salvar Desafio</Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 24,
  },
  hero: {
    aspectRatio: 16 / 9,
    borderRadius: 12,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#10233B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  intro: {
    gap: 4,
  },
  introTitle: {
    color: colors.onSurface,
    fontFamily: fonts.displayBold,
    fontSize: 24,
    lineHeight: 32,
  },
  introSubtitle: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.02,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    borderWidth: 1.5,
    color: colors.onSurface,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputWithAdornment: {
    paddingRight: 48,
  },
  adornmentEnd: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
    top: 0,
  },
  suffixText: {
    color: colors.primary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.02,
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldError: {
    color: colors.error,
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    marginTop: 2,
  },
  toggleRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    shadowColor: '#10233B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  toggleLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  toggleIconBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 109, 64, 0.12)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  toggleCopy: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    color: colors.onSurface,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  toggleSubtitle: {
    color: colors.onSurfaceVariant,
    fontFamily: fonts.bodyRegular,
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
  actionBlock: {
    backgroundColor: colors.background,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    gap: 10,
    height: 56,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    color: colors.onPrimary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    letterSpacing: 0.02,
  },
});
