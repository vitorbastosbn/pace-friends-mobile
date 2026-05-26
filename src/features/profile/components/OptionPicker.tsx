import { useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface PickerOption<T extends string> {
  label: string;
  value: T;
}

interface OptionPickerProps<T extends string> {
  label: string;
  options: PickerOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  disabled?: boolean;
}

export function OptionPicker<T extends string>({
  label,
  options,
  selectedValue,
  onSelect,
  disabled = false,
}: OptionPickerProps<T>) {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? selectedValue;

  function handleSelect(value: T) {
    onSelect(value);
    setVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.selector,
          disabled && styles.selectorDisabled,
          pressed && !disabled && styles.selectorPressed,
        ]}
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedLabel}. Toque para alterar.`}
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.selectorText, disabled && styles.selectorTextDisabled]}>
          {selectedLabel}
        </Text>
        <Text style={[styles.chevron, disabled && styles.selectorTextDisabled]}>
          {'›'}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        accessibilityViewIsModal
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
          accessibilityLabel="Fechar seletor"
        >
          <SafeAreaView style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <Pressable
                onPress={() => setVisible(false)}
                style={styles.closeButton}
                accessibilityLabel="Fechar"
                accessibilityRole="button"
                hitSlop={8}
              >
                <Text style={styles.closeText}>Fechar</Text>
              </Pressable>
            </View>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.option,
                    option.value === selectedValue && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => handleSelect(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: option.value === selectedValue }}
                  accessibilityLabel={option.label}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option.value === selectedValue && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === selectedValue && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#546E7A',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 12,
  },
  selectorDisabled: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  selectorPressed: {
    backgroundColor: '#EEF2FF',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  selectorTextDisabled: {
    color: '#9E9E9E',
  },
  chevron: {
    fontSize: 20,
    color: '#546E7A',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D47A1',
  },
  closeButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#546E7A',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionSelected: {
    backgroundColor: '#EEF2FF',
  },
  optionPressed: {
    backgroundColor: '#F1F3F4',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#0D47A1',
  },
  checkmark: {
    fontSize: 16,
    color: '#0D47A1',
    fontWeight: '700',
  },
});
