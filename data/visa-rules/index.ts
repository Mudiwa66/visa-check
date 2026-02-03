import { DestinationRules, VisaRequirement, NationalityCode, DestinationCode } from './types';

export type { VisaType, VisaRequirement, DestinationRules, NationalityCode, DestinationCode } from './types';

type NationalityLoader = () => Promise<{ default: DestinationRules }>;

const nationalityLoaders: Record<string, NationalityLoader> = {
  US: () => import('./nationalities/US'),
  ZA: () => import('./nationalities/ZA'),
  DE: () => import('./nationalities/DE'),
  GB: () => import('./nationalities/GB'),
  NL: () => import('./nationalities/NL'),
};

const cache: Map<NationalityCode, DestinationRules> = new Map();

export function getSupportedNationalities(): NationalityCode[] {
  return Object.keys(nationalityLoaders);
}

export function hasNationalityData(nationalityCode: NationalityCode): boolean {
  return nationalityCode in nationalityLoaders;
}

export async function getVisaRules(nationalityCode: NationalityCode): Promise<DestinationRules | null> {
  if (cache.has(nationalityCode)) {
    return cache.get(nationalityCode)!;
  }

  const loader = nationalityLoaders[nationalityCode];
  if (!loader) {
    return null;
  }

  try {
    const module = await loader();
    const rules = module.default;
    cache.set(nationalityCode, rules);
    return rules;
  } catch (error) {
    console.error(`Failed to load visa rules for ${nationalityCode}:`, error);
    return null;
  }
}

export async function getVisaRule(
  nationalityCode: NationalityCode,
  destinationCode: DestinationCode
): Promise<VisaRequirement | null> {
  const rules = await getVisaRules(nationalityCode);
  if (!rules) {
    return null;
  }
  return rules[destinationCode] || null;
}

export function getVisaRulesSync(nationalityCode: NationalityCode): DestinationRules | null {
  return cache.get(nationalityCode) || null;
}

export function getVisaRuleSync(
  nationalityCode: NationalityCode,
  destinationCode: DestinationCode
): VisaRequirement | null {
  const rules = cache.get(nationalityCode);
  if (!rules) {
    return null;
  }
  return rules[destinationCode] || null;
}

export async function preloadNationality(nationalityCode: NationalityCode): Promise<void> {
  await getVisaRules(nationalityCode);
}

export async function preloadAllNationalities(): Promise<void> {
  await Promise.all(Object.keys(nationalityLoaders).map(getVisaRules));
}

export function clearCache(): void {
  cache.clear();
}

export function getLoadedNationalities(): NationalityCode[] {
  return Array.from(cache.keys());
}
