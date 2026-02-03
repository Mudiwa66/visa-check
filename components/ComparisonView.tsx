import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { countries } from "../data/countries";
import { SPACING, BORDER_RADIUS, FONT_SIZE, AppColors } from "../constants/theme";

import { DestinationRules, VisaRequirement, VisaType } from "../data/visa-rules";

type Props = {
  destinationCodes: string[];
  visaRules: DestinationRules | null;
  onRemove?: (code: string) => void;
};

const countryByCode = new Map(countries.map((c) => [c.code, c.name]));

function getVisaTypeLabel(type: VisaType): string {
  switch (type) {
    case "visa-free":
      return "Visa Free";
    case "visa-on-arrival":
      return "Visa on Arrival";
    case "e-visa":
      return "E-Visa Required";
    case "eta-required":
      return "ETA Required";
    case "visa-required":
      return "Visa Required";
  }
}

function getVisaTypeColor(type: VisaType | null): {
  background: string;
  border: string;
  text: string;
} {
  if (!type) {
    return AppColors.visa.unknown;
  }
  switch (type) {
    case "visa-free":
      return AppColors.visa.free;
    case "visa-on-arrival":
      return AppColors.visa.onArrival;
    case "e-visa":
      return AppColors.visa.eVisa;
    case "eta-required":
      return AppColors.visa.etaRequired;
    case "visa-required":
      return AppColors.visa.required;
  }
}

export default function ComparisonView({
  destinationCodes,
  visaRules,
  onRemove,
}: Props) {
  if (destinationCodes.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: SPACING.base }}>
      <Text style={{ fontSize: FONT_SIZE.md, fontWeight: "600", marginBottom: SPACING.md, color: AppColors.text.primary }}>
        Visa Comparison
      </Text>
      <ScrollView style={{ maxHeight: 400 }}>
        {destinationCodes.map((destCode) => {
          const visaData = visaRules?.[destCode];
          const countryName = countryByCode.get(destCode) || destCode;
          const colors = getVisaTypeColor(visaData?.type || null);

          return (
            <View
              key={destCode}
              style={{
                backgroundColor: colors.background,
                borderWidth: 2,
                borderColor: colors.border,
                borderRadius: BORDER_RADIUS.lg,
                padding: SPACING.base,
                marginBottom: SPACING.md,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ fontSize: FONT_SIZE.lg, fontWeight: "600", marginBottom: SPACING.sm, flex: 1, color: AppColors.text.primary }}>
                  {countryName}
                </Text>
                {onRemove && (
                  <Pressable
                    onPress={() => onRemove(destCode)}
                    style={({ pressed }) => ({
                      padding: SPACING.xs,
                      marginLeft: SPACING.sm,
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Text style={{ color: AppColors.text.muted, fontSize: FONT_SIZE.md }}>✕</Text>
                  </Pressable>
                )}
              </View>

              {visaData ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: SPACING.xs + 2,
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: colors.border,
                        marginRight: SPACING.sm,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: FONT_SIZE.md,
                        fontWeight: "500",
                        color: colors.text,
                      }}
                    >
                      {getVisaTypeLabel(visaData.type)}
                    </Text>
                  </View>

                  <Text style={{ fontSize: FONT_SIZE.base, color: AppColors.text.secondary, marginBottom: SPACING.xs }}>
                    Stay: {visaData.maxStay}
                  </Text>

                  {visaData.cost && (
                    <Text style={{ fontSize: FONT_SIZE.base, color: AppColors.text.secondary, marginBottom: SPACING.xs }}>
                      Cost: {visaData.cost}
                    </Text>
                  )}

                  {visaData.notes && (
                    <Text
                      style={{ fontSize: FONT_SIZE.sm, color: AppColors.text.muted, fontStyle: "italic", marginBottom: SPACING.xs }}
                    >
                      {visaData.notes}
                    </Text>
                  )}

                  {visaData.sourceUrl ? (
                    <Pressable onPress={() => Linking.openURL(visaData.sourceUrl!)}>
                      <Text style={{ fontSize: FONT_SIZE.xs, color: AppColors.primary, textDecorationLine: "underline", marginTop: SPACING.xs }}>
                        {visaData.source} ↗
                      </Text>
                    </Pressable>
                  ) : (
                    <Text style={{ fontSize: FONT_SIZE.xs, color: AppColors.text.hint, marginTop: SPACING.xs }}>
                      {visaData.source}
                    </Text>
                  )}
                </>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: AppColors.visa.unknown.border,
                      marginRight: SPACING.sm,
                    }}
                  />
                  <Text style={{ fontSize: FONT_SIZE.base, color: AppColors.text.muted }}>
                    No visa information available
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
