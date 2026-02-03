import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import { countries } from "../data/countries";

type Props = {
  selectedCodes: string[];
  onSelectionChange: (codes: string[]) => void;
  excludeCode?: string;
};

const MAX_SELECTIONS = 3;

export default function MultiDestinationPicker({
  selectedCodes,
  onSelectionChange,
  excludeCode,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const availableCountries = excludeCode
    ? countries.filter((c) => c.code !== excludeCode)
    : countries;

  const filteredCountries = availableCountries.filter((country) => {
    const query = searchQuery.toLowerCase();
    return (
      country.code.toLowerCase().includes(query) ||
      country.name.toLowerCase().includes(query)
    );
  });

  const isAtLimit = selectedCodes.length >= MAX_SELECTIONS;

  const handleToggle = (code: string) => {
    if (selectedCodes.includes(code)) {
      onSelectionChange(selectedCodes.filter((c) => c !== code));
    } else if (!isAtLimit) {
      onSelectionChange([...selectedCodes, code]);
    }
  };

  const isSelected = (code: string) => selectedCodes.includes(code);
  const isDisabled = (code: string) => isAtLimit && !isSelected(code);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8 }}>Destination countries</Text>
      <Text style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>
        Selected: {selectedCodes.length}/{MAX_SELECTIONS}
      </Text>
      <TextInput
        placeholder="Search countries..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          padding: 12,
          backgroundColor: "#f9f9f9",
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 6,
          marginBottom: 8,
        }}
      />
      <ScrollView style={{ maxHeight: 250 }}>
        {filteredCountries.map((country) => {
          const selected = isSelected(country.code);
          const disabled = isDisabled(country.code);

          return (
            <Pressable
              key={country.code}
              onPress={() => !disabled && handleToggle(country.code)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                backgroundColor: selected ? "#e3f2fd" : disabled ? "#f5f5f5" : "#f2f2f2",
                marginBottom: 4,
                borderRadius: 6,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: selected ? "#007AFF" : "#999",
                  borderRadius: 4,
                  marginRight: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selected ? "#007AFF" : "transparent",
                }}
              >
                {selected && (
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                    ✓
                  </Text>
                )}
              </View>
              <Text style={{ color: disabled ? "#999" : "#333" }}>
                {country.name}
              </Text>
            </Pressable>
          );
        })}
        {filteredCountries.length === 0 && (
          <Text style={{ color: "#999", padding: 12 }}>No results found</Text>
        )}
      </ScrollView>
    </View>
  );
}
