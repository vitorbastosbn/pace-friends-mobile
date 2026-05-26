import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useFriendChallenges } from '../hooks/useFriendChallenges';
import type { ChallengeType } from '../types/challenge.types';

interface CreateFriendChallengeScreenProps {
  token: string;
}

const CHALLENGE_TYPES: { value: ChallengeType; label: string; hasGoal: boolean; goalLabel: string }[] = [
  { value: 'DISTANCE', label: 'Distancia (km)', hasGoal: true, goalLabel: 'Meta em km' },
  { value: 'ACTIVITY_TIME', label: 'Tempo (min)', hasGoal: true, goalLabel: 'Meta em minutos' },
  { value: 'PACE', label: 'Pace', hasGoal: false, goalLabel: '' },
  { value: 'CHECK_IN', label: 'Check-ins', hasGoal: true, goalLabel: 'Quantidade de check-ins' },
];

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function CreateFriendChallengeScreen({ token }: CreateFriendChallengeScreenProps) {
  const router = useRouter();
  const { create, createState } = useFriendChallenges(token);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [challengeType, setChallengeType] = useState<ChallengeType>('DISTANCE');
  const [goalValueText, setGoalValueText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [titleError, setTitleError] = useState('');
  const [goalError, setGoalError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const isSubmitting = createState === 'submitting';
  const selectedType = CHALLENGE_TYPES.find((t) => t.value === challengeType)!;

  function validate(): boolean {
    let valid = true;
    setTitleError('');
    setGoalError('');
    setStartDateError('');
    setEndDateError('');
    setSubmitError('');

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Titulo e obrigatorio.');
      valid = false;
    } else if (trimmedTitle.length < 3) {
      setTitleError('Titulo deve ter pelo menos 3 caracteres.');
      valid = false;
    }

    if (selectedType.hasGoal) {
      const goalNum = parseFloat(goalValueText);
      if (!goalValueText || isNaN(goalNum) || goalNum <= 0) {
        setGoalError('Meta obrigatoria e deve ser maior que zero.');
        valid = false;
      }
    }

    if (!DATE_REGEX.test(startDate)) {
      setStartDateError('Data no formato AAAA-MM-DD.');
      valid = false;
    }

    if (!DATE_REGEX.test(endDate)) {
      setEndDateError('Data no formato AAAA-MM-DD.');
      valid = false;
    }

    return valid;
  }

  async function handleSave() {
    if (!validate()) return;

    const result = await create({
      title: title.trim(),
      description: description.trim() || undefined,
      challengeType,
      goalValue: selectedType.hasGoal ? parseFloat(goalValueText) : undefined,
      startDate,
      endDate,
    });

    if (result) {
      Alert.alert(
        'Desafio criado!',
        `Codigo de convite: ${result.inviteCode}\n\nCompartilhe este codigo com seus amigos.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      setSubmitError('Nao foi possivel criar o desafio. Tente novamente.');
    }
  }

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
          Novo Desafio com Amigos
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
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Titulo <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, titleError ? styles.inputError : null]}
              value={title}
              onChangeText={(v) => { setTitle(v); setTitleError(''); }}
              placeholder="Ex: Corrida de Maio"
              placeholderTextColor="#B0BEC5"
              maxLength={100}
              editable={!isSubmitting}
              accessibilityLabel="Titulo do desafio"
            />
            {!!titleError && <Text style={styles.fieldError}>{titleError}</Text>}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Descricao (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Quem corre mais em 30 dias?"
              placeholderTextColor="#B0BEC5"
              maxLength={500}
              multiline
              numberOfLines={3}
              editable={!isSubmitting}
              accessibilityLabel="Descricao do desafio"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Tipo <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.typeGrid}>
              {CHALLENGE_TYPES.map((t) => (
                <Pressable
                  key={t.value}
                  style={[
                    styles.typeOption,
                    challengeType === t.value && styles.typeOptionSelected,
                  ]}
                  onPress={() => {
                    setChallengeType(t.value);
                    setGoalError('');
                    setGoalValueText('');
                  }}
                  accessibilityLabel={t.label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: challengeType === t.value }}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      challengeType === t.value && styles.typeOptionTextSelected,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {selectedType.hasGoal && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {selectedType.goalLabel} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, goalError ? styles.inputError : null]}
                value={goalValueText}
                onChangeText={(v) => { setGoalValueText(v); setGoalError(''); }}
                placeholder="Ex: 50"
                placeholderTextColor="#B0BEC5"
                keyboardType="decimal-pad"
                editable={!isSubmitting}
                accessibilityLabel={selectedType.goalLabel}
              />
              {!!goalError && <Text style={styles.fieldError}>{goalError}</Text>}
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Data de inicio (AAAA-MM-DD) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, startDateError ? styles.inputError : null]}
              value={startDate}
              onChangeText={(v) => { setStartDate(v); setStartDateError(''); }}
              placeholder="Ex: 2026-05-26"
              placeholderTextColor="#B0BEC5"
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              editable={!isSubmitting}
              accessibilityLabel="Data de inicio"
            />
            {!!startDateError && <Text style={styles.fieldError}>{startDateError}</Text>}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Data de fim (AAAA-MM-DD) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, endDateError ? styles.inputError : null]}
              value={endDate}
              onChangeText={(v) => { setEndDate(v); setEndDateError(''); }}
              placeholder="Ex: 2026-06-25"
              placeholderTextColor="#B0BEC5"
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              editable={!isSubmitting}
              accessibilityLabel="Data de fim"
            />
            {!!endDateError && <Text style={styles.fieldError}>{endDateError}</Text>}
          </View>

          {!!submitError && (
            <Text style={styles.submitError} accessibilityRole="alert">
              {submitError}
            </Text>
          )}
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
            accessibilityLabel="Criar desafio"
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Criar Desafio</Text>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
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
  inputMultiline: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: { borderColor: '#D32F2F' },
  fieldError: { fontSize: 12, color: '#D32F2F', marginTop: 4 },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    backgroundColor: '#FFFFFF',
  },
  typeOptionSelected: {
    borderColor: '#3a73ff',
    backgroundColor: '#EEF4FF',
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#546E7A',
  },
  typeOptionTextSelected: { color: '#3a73ff' },
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
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonPressed: { backgroundColor: '#0A3880' },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.25 },
});
