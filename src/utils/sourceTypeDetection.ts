const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const CITATION_INDICATORS = [
  'pp.',
  'vol.',
  'ed.',
  'et al.',
  'ibid',
  'op. cit.',
  'in:',
  'chapter',
  '©',
  'published',
  'press',
];

export const detectSourceType = (input: string): 'url' | 'manual' | null => {
  if (URL_REGEX.test(input)) {
    return 'url';
  }

  const lowerInput = input.toLowerCase();
  if (CITATION_INDICATORS.some(indicator => lowerInput.includes(indicator))) {
    return 'manual';
  }

  return null;
};