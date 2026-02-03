import { View, Text, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS, FONT_SIZE, AppColors } from '../constants/theme';

type VisaType = 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'visa-required' | 'eta-required';

interface VisaResult {
  type: VisaType;
  maxStay: string;
  cost?: string;
  notes?: string;
  source: string;
}

interface VisaResultCardProps {
  result: VisaResult;
}

const VALID_VISA_TYPES: VisaType[] = ['visa-free', 'visa-on-arrival', 'e-visa', 'visa-required', 'eta-required'];

function isValidVisaType(type: unknown): type is VisaType {
  return typeof type === 'string' && VALID_VISA_TYPES.includes(type as VisaType);
}

export default function VisaResultCard({ result }: VisaResultCardProps) {
  if (!result || typeof result !== 'object') {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorText}>Unable to display visa information</Text>
      </View>
    );
  }

  const visaType = isValidVisaType(result.type) ? result.type : null;

  const getVisaTypeLabel = (type: VisaType | null): string => {
    switch (type) {
      case 'visa-free':
        return 'Visa Free';
      case 'visa-on-arrival':
        return 'Visa on Arrival';
      case 'e-visa':
        return 'E-Visa Required';
      case 'eta-required':
        return 'ETA Required';
      case 'visa-required':
        return 'Visa Required';
      default:
        return 'Unknown Visa Type';
    }
  };

  const getCardStyle = (type: VisaType | null) => {
    switch (type) {
      case 'visa-free':
        return styles.visaFree;
      case 'visa-on-arrival':
        return styles.visaOnArrival;
      case 'e-visa':
        return styles.eVisa;
      case 'eta-required':
        return styles.etaRequired;
      case 'visa-required':
        return styles.visaRequired;
      default:
        return styles.unknownType;
    }
  };

  return (
    <View style={[styles.card, getCardStyle(visaType)]}>
      <Text style={styles.visaType}>{getVisaTypeLabel(visaType)}</Text>
      <Text style={styles.maxStay}>
        Maximum Stay: {result.maxStay || 'Not specified'}
      </Text>
      {result.cost && <Text style={styles.cost}>Cost: {result.cost}</Text>}
      {result.notes && <Text style={styles.notes}>{result.notes}</Text>}
      <Text style={styles.source}>
        Source: {result.source || 'Source not available'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.sm + 2,
    borderWidth: 2,
  },
  visaFree: {
    backgroundColor: AppColors.visa.free.background,
    borderColor: AppColors.visa.free.border,
  },
  visaOnArrival: {
    backgroundColor: AppColors.visa.onArrival.background,
    borderColor: AppColors.visa.onArrival.border,
  },
  eVisa: {
    backgroundColor: AppColors.visa.eVisa.background,
    borderColor: AppColors.visa.eVisa.border,
  },
  etaRequired: {
    backgroundColor: AppColors.visa.etaRequired.background,
    borderColor: AppColors.visa.etaRequired.border,
  },
  visaRequired: {
    backgroundColor: AppColors.visa.required.background,
    borderColor: AppColors.visa.required.border,
  },
  unknownType: {
    backgroundColor: AppColors.visa.unknown.background,
    borderColor: AppColors.visa.unknown.border,
  },
  errorCard: {
    backgroundColor: AppColors.error.background,
    borderColor: AppColors.error.border,
  },
  errorText: {
    fontSize: FONT_SIZE.base,
    color: AppColors.error.text,
    textAlign: 'center' as const,
  },
  visaType: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: AppColors.text.primary,
  },
  maxStay: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
    color: AppColors.text.secondary,
  },
  cost: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
    fontWeight: '500' as const,
    color: AppColors.text.secondary,
  },
  notes: {
    fontSize: FONT_SIZE.base,
    color: AppColors.text.muted,
    marginBottom: SPACING.sm,
    fontStyle: 'italic' as const,
  },
  source: {
    fontSize: FONT_SIZE.sm,
    color: AppColors.text.hint,
    marginTop: SPACING.sm,
  },
});
