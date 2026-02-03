import { View, Text, Pressable, TextInput } from "react-native";
import { useState, useRef } from "react";
import { SPACING, BORDER_RADIUS, FONT_SIZE, AppColors } from "../constants/theme";

type CountryOption = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  onClear?: () => void;
  options: string[] | CountryOption[];
  searchValue: string;
  onSearchChange: (value: string) => void;
};

function getOptionValue(option: string | CountryOption, isStringArray: boolean): string {
  return isStringArray ? (option as string) : (option as CountryOption).value;
}

function getOptionLabel(option: string | CountryOption, isStringArray: boolean): string {
  return isStringArray ? (option as string) : (option as CountryOption).label;
}

const MAX_SEARCH_LENGTH = 100;

function sanitizeSearchInput(input: string): string {
  return input.slice(0, MAX_SEARCH_LENGTH).trim();
}

export default function CountryPicker({
  label,
  value,
  onChange,
  onClear,
  options,
  searchValue,
  onSearchChange,
}: Props) {
  const searchQuery = searchValue;
  const isSearching = searchQuery.length > 0;
  const hasOptions = options && options.length > 0;
  const isStringArray = hasOptions && typeof options[0] === "string";
  const lastSearchRef = useRef(searchQuery);
  const [justSelected, setJustSelected] = useState(false);

  if (searchQuery !== lastSearchRef.current) {
    lastSearchRef.current = searchQuery;
    if (justSelected) {
      setJustSelected(false);
    }
  }

  const selectedOption = value && hasOptions
    ? options.find((opt) => getOptionValue(opt, isStringArray) === value)
    : null;

  const filteredOptions = hasOptions
    ? options.filter((option) => {
        const optionValue = getOptionValue(option, isStringArray);
        const optionLabel = getOptionLabel(option, isStringArray);
        const query = sanitizeSearchInput(searchQuery).toLowerCase();

        if (!query) return false;

        return (
          optionValue.toLowerCase().includes(query) ||
          optionLabel.toLowerCase().includes(query)
        );
      })
    : [];

  const handleSearchChange = (text: string) => {
    const sanitized = text.slice(0, MAX_SEARCH_LENGTH);
    onSearchChange(sanitized);
  };

  const handleSelect = (optionValue: string) => {
    if (!optionValue || !hasOptions) return;

    const isValidOption = options.some(
      (opt) => getOptionValue(opt, isStringArray) === optionValue
    );

    if (!isValidOption) {
      console.warn("Attempted to select invalid option:", optionValue);
      return;
    }

    setJustSelected(true);
    onChange(optionValue);
  };

  const handleClear = () => {
    onSearchChange("");
    setJustSelected(false);
    onClear?.();
  };

  const showList = isSearching && !justSelected && hasOptions;
  const showSelectedOnly = selectedOption && (justSelected || !isSearching);
  const showNoResults = isSearching && !justSelected && filteredOptions.length === 0 && hasOptions;
  const showNoOptions = !hasOptions;

  return (
    <View style={{ marginBottom: SPACING.base }}>
      <Text style={{ marginBottom: SPACING.sm, fontSize: FONT_SIZE.base, color: AppColors.text.primary, fontWeight: "500" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.sm }}>
        <TextInput
          placeholder="Search..."
          placeholderTextColor={AppColors.text.hint}
          value={searchQuery}
          onChangeText={handleSearchChange}
          maxLength={MAX_SEARCH_LENGTH}
          editable={hasOptions}
          style={{
            flex: 1,
            padding: SPACING.md,
            backgroundColor: AppColors.surfaceAlt,
            borderWidth: 1,
            borderColor: AppColors.border.input,
            borderRadius: BORDER_RADIUS.sm,
            fontSize: FONT_SIZE.base,
            color: AppColors.text.primary,
          }}
        />
        {(isSearching || value) && (
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => ({
              marginLeft: SPACING.sm,
              padding: SPACING.sm,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: FONT_SIZE.lg, color: AppColors.text.muted }}>✕</Text>
          </Pressable>
        )}
      </View>
      {showSelectedOnly && (
        <>
          <Text style={{ marginBottom: SPACING.xs, color: AppColors.text.muted, fontSize: FONT_SIZE.sm }}>
            Selected country
          </Text>
          <View
            style={{
              padding: SPACING.md,
              backgroundColor: AppColors.visa.onArrival.background,
              borderWidth: 1,
              borderColor: AppColors.visa.onArrival.border,
              marginBottom: SPACING.xs,
              borderRadius: BORDER_RADIUS.sm,
            }}
          >
            <Text style={{ fontSize: FONT_SIZE.base, color: AppColors.text.secondary, fontWeight: "500" }}>{getOptionLabel(selectedOption, isStringArray)}</Text>
          </View>
        </>
      )}
      {showList &&
        filteredOptions.map((option) => {
          const optionValue = getOptionValue(option, isStringArray);
          const optionLabel = getOptionLabel(option, isStringArray);

          return (
            <Pressable
              key={optionValue}
              onPress={() => handleSelect(optionValue)}
              style={({ pressed }) => ({
                padding: SPACING.md,
                backgroundColor: pressed ? AppColors.border.light : (value === optionValue ? AppColors.border.light : AppColors.surfaceAlt),
                marginBottom: SPACING.xs,
                borderRadius: BORDER_RADIUS.sm,
              })}
            >
              <Text style={{ fontSize: FONT_SIZE.base, color: AppColors.text.secondary }}>{optionLabel}</Text>
            </Pressable>
          );
        })}
      {showNoResults && (
        <Text style={{ color: AppColors.text.hint, padding: SPACING.md, fontSize: FONT_SIZE.base }}>No results found</Text>
      )}
      {showNoOptions && (
        <Text style={{ color: AppColors.visa.required.text, padding: SPACING.md, fontSize: FONT_SIZE.base }}>
          No countries available. Please try again later.
        </Text>
      )}
    </View>
  );
}
