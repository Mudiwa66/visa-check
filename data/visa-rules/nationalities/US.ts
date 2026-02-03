import { DestinationRules } from '../types';

const rules: DestinationRules = {
  TH: {
    type: 'visa-free',
    maxStay: '60 days',
    notes: 'Must complete Thailand Digital Arrival Card (TDAC) online within 72 hours before arrival',
    source: 'US State Department, Jan 2026',
  },
  PT: {
    type: 'visa-free',
    maxStay: '90 days (Schengen)',
    notes: 'ETIAS required starting late 2026 (€20, valid 3 years). Part of Schengen 90/180 rule',
    source: 'Portuguese Embassy, Jan 2026',
  },
  MX: {
    type: 'visa-free',
    maxStay: '180 days',
    cost: '~$40 USD',
    notes: 'FMM tourist card required (~$40 USD at land border). Visitax for Quintana Roo',
    source: 'US State Department, Jan 2026',
  },
  ID: {
    type: 'visa-on-arrival',
    maxStay: '30 days (extendable to 60)',
    cost: '$35 USD',
    notes: 'e-VOA recommended. Bali tourist tax ~$10 USD. 6-month passport validity required',
    source: 'Indonesian Immigration, Jan 2026',
  },
  ES: {
    type: 'visa-free',
    maxStay: '90 days (Schengen)',
    notes: 'ETIAS required starting late 2026 (€20, valid 3 years). Part of Schengen 90/180 rule',
    source: 'Spanish Embassy, Jan 2026',
  },
  AE: {
    type: 'visa-free',
    maxStay: '90 days within 180 days',
    notes: 'Free visa issued on arrival. Passport must be valid 6+ months. Proof of onward travel required',
    source: 'UAE Embassy, Jan 2026',
  },
  GB: {
    type: 'eta-required',
    maxStay: '180 days',
    cost: '$20 USD',
    notes: 'ETA mandatory from Feb 25, 2026. Valid 2 years or until passport expires. Apply via UK ETA app',
    source: 'UK Home Office, Jan 2026',
  },
  JP: {
    type: 'visa-free',
    maxStay: '90 days',
    notes: 'No visa required for tourism or business. Fingerprints and photo taken at entry. Visit Japan Web available for optional pre-registration.',
    source: 'Ministry of Foreign Affairs of Japan & US State Department, Jan 2026',
  },
  KR: {
    type: 'visa-free',
    maxStay: '90 days',
    notes: 'K-ETA exemption extended through December 31, 2026. Starting January 1, 2027, K-ETA will be required. Currently no visa needed for tourism/business.',
    source: 'US State Department & US Embassy South Korea, Jan 2026',
  },
  VN: {
    type: 'e-visa',
    maxStay: '90 days',
    cost: '$25 USD (single) / $50 USD (multiple)',
    notes: 'All US citizens require a visa. Apply online at evisa.gov.vn. Processing 3-5 business days. Passport must be valid 6+ months from arrival.',
    source: 'US State Department & Vietnam Immigration, Jan 2026',
  },
  CO: {
    type: 'visa-free',
    maxStay: '90 days (extendable to 180 days/year)',
    notes: 'No visa required for tourism/business. Immigration stamps for 90 days initially, extendable for another 90 days. Proof of onward travel required.',
    source: 'Colombia Travel & US State Department, Jan 2026',
  },
  GR: {
    type: 'visa-free',
    maxStay: '90 days in 180 days',
    notes: 'Schengen Area. No visa for stays up to 90 days. ETIAS required from late 2026. Passport valid 3+ months beyond departure required. EES biometric registration at border.',
    source: 'US State Department & EU Official, Jan 2026',
  },
  HR: {
    type: 'visa-free',
    maxStay: '90 days in 180 days',
    notes: 'Schengen Area since Jan 2023. Same 90/180-day rule as all Schengen countries. ETIAS required from late 2026. Must register with police within 48 hours (automatic for hotels).',
    source: 'US Embassy Croatia & EU Official, Jan 2026',
  },
  NL: {
    type: 'visa-free',
    maxStay: '90 days in 180 days',
    notes: 'Schengen Area. No visa for tourism/business up to 90 days. ETIAS required from late 2026. Passport must be valid 3+ months beyond departure from Schengen.',
    source: 'US State Department & EU Official, Jan 2026',
  },
  FR: {
    type: 'visa-free',
    maxStay: '90 days in 180 days',
    notes: 'Schengen Area. No visa for tourism/business up to 90 days. ETIAS required from late 2026. Time in any Schengen country counts toward 90-day limit.',
    source: 'US State Department & EU Official, Jan 2026',
  },
};

export default rules;
