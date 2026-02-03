export type VisaType = 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'visa-required' | 'eta-required';

export interface VisaRequirement {
  type: VisaType;
  maxStay: string;
  cost?: string;
  notes?: string;
  source: string;
  sourceUrl?: string;
}

export type DestinationRules = {
  [destinationCode: string]: VisaRequirement;
};

export type NationalityCode = string;
export type DestinationCode = string;
