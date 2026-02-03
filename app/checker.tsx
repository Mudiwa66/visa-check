import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "../components/CountryPicker";
import MultiDestinationPicker from "../components/MultiDestinationPicker";
import ComparisonView from "../components/ComparisonView";
import ErrorBoundary from "../components/ErrorBoundary";
import { getVisaRules, DestinationRules, VisaRequirement } from "../data/visa-rules";
import VisaResultCard from "../components/VisaResultCard";
import { countries } from "../data/countries";
import { SPACING, BORDER_RADIUS, FONT_SIZE, AppColors } from "../constants/theme";

const STORAGE_KEY_NATIONALITY = "selectedNationality";
const STORAGE_KEY_DESTINATION = "selectedDestination";
const STORAGE_KEY_MODE = "mode";
const STORAGE_KEY_COMPARISON_DESTINATIONS = "comparisonDestinations";

type Mode = "single" | "compare";

type VisaDataStatus = {
  available: boolean;
  data: VisaRequirement | null;
  message: string | null;
};

function getVisaDataStatus(
  nationalityRules: DestinationRules | null,
  destinationCode: string | null
): VisaDataStatus {
  if (!destinationCode) {
    return { available: false, data: null, message: null };
  }

  if (!nationalityRules) {
    return {
      available: false,
      data: null,
      message: "No visa data available for this passport",
    };
  }

  const visaData = nationalityRules[destinationCode];
  if (!visaData) {
    return {
      available: false,
      data: null,
      message: "Visa information not available for this route",
    };
  }

  return { available: true, data: visaData, message: null };
}

function CheckerContent() {
  const [mode, setMode] = useState<Mode>("single");
  const [nationalityCode, setNationalityCode] = useState<string | null>(null);
  const [destinationCode, setDestinationCode] = useState<string | null>(null);
  const [destinationCodes, setDestinationCodes] = useState<string[]>([]);
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadedRules, setLoadedRules] = useState<DestinationRules | null>(null);

  const countryByCode = useMemo(() => {
    const map = new Map<string, string>();
    countries.forEach((c) => map.set(c.code, c.name));
    return map;
  }, []);

  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.code, label: c.name })),
    []
  );

  const nationalityOptions = countryOptions;

  const destinationOptions = countryOptions;

  const visaStatus = useMemo(
    () => getVisaDataStatus(loadedRules, destinationCode),
    [loadedRules, destinationCode]
  );

  const handleNationalityChange = (code: string) => {
    setNationalityCode(code);
    setDestinationCode(null);
    setDestinationCodes([]);
    setDestinationSearch("");
  };

  const handleNationalityClear = () => {
    setNationalityCode(null);
    setDestinationCode(null);
    setDestinationCodes([]);
    setDestinationSearch("");
  };

  const handleDestinationClear = () => {
    setDestinationCode(null);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === "single") {
      setDestinationCodes([]);
    }
  };

  const handleRemoveDestination = (code: string) => {
    setDestinationCodes(destinationCodes.filter((c) => c !== code));
  };

  const handleClearAllDestinations = () => {
    setDestinationCodes([]);
  };

  const handleReset = () => {
    setMode("single");
    setNationalityCode(null);
    setDestinationCode(null);
    setDestinationCodes([]);
    setNationalitySearch("");
    setDestinationSearch("");
  };

  useEffect(() => {
    if (nationalityCode) {
      getVisaRules(nationalityCode).then(setLoadedRules);
    } else {
      setLoadedRules(null);
    }
  }, [nationalityCode]);

  useEffect(() => {
    let isMounted = true;

    const loadSavedSelections = async () => {
      try {
        const [savedNationality, savedDestination, savedMode, savedComparisonDestinations] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEY_NATIONALITY),
            AsyncStorage.getItem(STORAGE_KEY_DESTINATION),
            AsyncStorage.getItem(STORAGE_KEY_MODE),
            AsyncStorage.getItem(STORAGE_KEY_COMPARISON_DESTINATIONS),
          ]);

        if (!isMounted) return;

        if (savedMode === "single" || savedMode === "compare") {
          setMode(savedMode);
        }

        if (savedNationality && countryByCode.has(savedNationality)) {
          setNationalityCode(savedNationality);

          if (savedDestination && countryByCode.has(savedDestination)) {
            setDestinationCode(savedDestination);
          }

          if (savedComparisonDestinations) {
            try {
              const codes = JSON.parse(savedComparisonDestinations) as string[];
              const validCodes = codes.filter((code) => countryByCode.has(code));
              setDestinationCodes(validCodes);
            } catch {
              // Invalid JSON, ignore
            }
          }
        }
      } catch (error) {
        console.error("Failed to load saved selections:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSavedSelections();

    return () => {
      isMounted = false;
    };
  }, [countryByCode]);

  useEffect(() => {
    const saveNationality = async () => {
      try {
        if (nationalityCode) {
          await AsyncStorage.setItem(STORAGE_KEY_NATIONALITY, nationalityCode);
        } else {
          await AsyncStorage.multiRemove([STORAGE_KEY_NATIONALITY, STORAGE_KEY_DESTINATION]);
        }
      } catch (error) {
        console.error("Failed to save nationality:", error);
      }
    };

    saveNationality();
  }, [nationalityCode]);

  useEffect(() => {
    const saveDestination = async () => {
      try {
        if (destinationCode) {
          await AsyncStorage.setItem(STORAGE_KEY_DESTINATION, destinationCode);
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY_DESTINATION);
        }
      } catch (error) {
        console.error("Failed to save destination:", error);
      }
    };

    saveDestination();
  }, [destinationCode]);

  useEffect(() => {
    const saveMode = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_MODE, mode);
      } catch (error) {
        console.error("Failed to save mode:", error);
      }
    };

    saveMode();
  }, [mode]);

  useEffect(() => {
    const saveComparisonDestinations = async () => {
      try {
        if (destinationCodes.length > 0) {
          await AsyncStorage.setItem(
            STORAGE_KEY_COMPARISON_DESTINATIONS,
            JSON.stringify(destinationCodes)
          );
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY_COMPARISON_DESTINATIONS);
        }
      } catch (error) {
        console.error("Failed to save comparison destinations:", error);
      }
    };

    saveComparisonDestinations();
  }, [destinationCodes]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: AppColors.background }}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={{ marginTop: SPACING.md, color: AppColors.text.muted, fontSize: FONT_SIZE.base }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: AppColors.background }}
      contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl + SPACING.sm }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: FONT_SIZE.xl, fontWeight: "600", marginBottom: SPACING.xl, color: AppColors.text.primary }}>
        Visa Checker
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginBottom: SPACING.xl,
          borderRadius: BORDER_RADIUS.md,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: AppColors.border.input,
        }}
      >
        <Pressable
          onPress={() => handleModeChange("single")}
          style={({ pressed }) => ({
            flex: 1,
            padding: SPACING.md,
            alignItems: "center",
            backgroundColor: mode === "single" ? AppColors.mode.active : AppColors.mode.inactive,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ color: mode === "single" ? AppColors.mode.activeText : AppColors.mode.inactiveText, fontWeight: "500" }}>
            Single Destination
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleModeChange("compare")}
          style={({ pressed }) => ({
            flex: 1,
            padding: SPACING.md,
            alignItems: "center",
            backgroundColor: mode === "compare" ? AppColors.mode.active : AppColors.mode.inactive,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ color: mode === "compare" ? AppColors.mode.activeText : AppColors.mode.inactiveText, fontWeight: "500" }}>
            Compare Multiple
          </Text>
        </Pressable>
      </View>

      {!nationalityCode && (
        <View style={{ paddingVertical: SPACING.xxl, alignItems: "center" }}>
          <Text style={{ fontSize: FONT_SIZE.md, color: AppColors.text.muted, textAlign: "center" }}>
            Select your home country to begin
          </Text>
        </View>
      )}

      {mode === "single" && (
        <>
          <CountryPicker
            label="Home country"
            value={nationalityCode}
            onChange={handleNationalityChange}
            onClear={handleNationalityClear}
            options={nationalityOptions}
            searchValue={nationalitySearch}
            onSearchChange={setNationalitySearch}
          />

          {nationalityCode && (
            <CountryPicker
              label="Destination country"
              value={destinationCode}
              onChange={setDestinationCode}
              onClear={handleDestinationClear}
              options={destinationOptions}
              searchValue={destinationSearch}
              onSearchChange={setDestinationSearch}
            />
          )}

          {nationalityCode && destinationCode && visaStatus.available && visaStatus.data && (
            <VisaResultCard result={visaStatus.data} />
          )}

          {nationalityCode && destinationCode && !visaStatus.available && (
            <View
              style={{
                marginTop: SPACING.lg,
                padding: SPACING.base,
                backgroundColor: AppColors.warning.background,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 1,
                borderColor: AppColors.warning.border,
              }}
            >
              <Text style={{ color: AppColors.warning.text, fontWeight: "500", fontSize: FONT_SIZE.base }}>
                {visaStatus.message}
              </Text>
              <Text style={{ color: AppColors.text.muted, fontSize: FONT_SIZE.sm, marginTop: SPACING.xs }}>
                Please check official embassy or consulate websites for the most accurate information.
              </Text>
            </View>
          )}

          {nationalityCode && (
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => ({
                marginTop: SPACING.lg,
                padding: SPACING.md,
                backgroundColor: pressed ? AppColors.border.light : AppColors.button.secondary,
                borderRadius: BORDER_RADIUS.md,
                alignItems: "center",
              })}
            >
              <Text style={{ color: AppColors.button.secondaryText, fontWeight: "500" }}>Reset</Text>
            </Pressable>
          )}
        </>
      )}

      {mode === "compare" && (
        <>
          <CountryPicker
            label="Home country"
            value={nationalityCode}
            onChange={handleNationalityChange}
            onClear={handleNationalityClear}
            options={nationalityOptions}
            searchValue={nationalitySearch}
            onSearchChange={setNationalitySearch}
          />

          {nationalityCode && (
            <>
              <MultiDestinationPicker
                selectedCodes={destinationCodes}
                onSelectionChange={setDestinationCodes}
                excludeCode={nationalityCode}
              />

              {destinationCodes.length === 0 && (
                <View style={{ paddingVertical: SPACING.xl, alignItems: "center" }}>
                  <Text style={{ color: AppColors.text.muted, textAlign: "center", fontSize: FONT_SIZE.base }}>
                    Select up to 3 destinations to compare
                  </Text>
                </View>
              )}

              {destinationCodes.length > 0 && (
                <>
                  <View style={{ marginTop: SPACING.sm }}>
                    <Text style={{ marginBottom: SPACING.sm, color: AppColors.text.muted, fontSize: FONT_SIZE.sm }}>
                      Selected destinations
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm }}>
                      {destinationCodes.map((code) => (
                        <View
                          key={code}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: AppColors.chip.background,
                            paddingVertical: SPACING.xs + 2,
                            paddingLeft: SPACING.md,
                            paddingRight: SPACING.xs,
                            borderRadius: BORDER_RADIUS.xl,
                          }}
                        >
                          <Text style={{ color: AppColors.chip.text, marginRight: SPACING.xs }}>
                            {countryByCode.get(code) || code}
                          </Text>
                          <Pressable
                            onPress={() => handleRemoveDestination(code)}
                            style={({ pressed }) => ({
                              padding: SPACING.xs,
                              opacity: pressed ? 0.6 : 1,
                            })}
                          >
                            <Text style={{ color: AppColors.text.muted, fontSize: FONT_SIZE.base }}>✕</Text>
                          </Pressable>
                        </View>
                      ))}
                    </View>

                    <Pressable
                      onPress={handleClearAllDestinations}
                      style={({ pressed }) => ({
                        marginTop: SPACING.base,
                        padding: SPACING.md,
                        backgroundColor: pressed ? AppColors.border.light : AppColors.button.secondary,
                        borderRadius: BORDER_RADIUS.md,
                        alignItems: "center",
                      })}
                    >
                      <Text style={{ color: AppColors.button.secondaryText, fontWeight: "500" }}>Clear All Destinations</Text>
                    </Pressable>
                  </View>

                  <ComparisonView
                    destinationCodes={destinationCodes}
                    visaRules={loadedRules}
                    onRemove={handleRemoveDestination}
                  />
                </>
              )}

              <Pressable
                onPress={handleReset}
                style={({ pressed }) => ({
                  marginTop: SPACING.lg,
                  padding: SPACING.md,
                  backgroundColor: pressed ? AppColors.border.light : AppColors.button.secondary,
                  borderRadius: BORDER_RADIUS.md,
                  alignItems: "center",
                })}
              >
                <Text style={{ color: AppColors.button.secondaryText, fontWeight: "500" }}>Reset</Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

export default function Checker() {
  return (
    <ErrorBoundary>
      <CheckerContent />
    </ErrorBoundary>
  );
}
