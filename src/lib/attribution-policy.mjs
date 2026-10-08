// Public marketing codes only. Register new campaign codes before sharing links.
// An allowlist prevents arbitrary URL values (including names/medical details) being saved.
export const utmCodes = {
  utm_source: ['direct', 'psychologytoday', 'psychology-today', 'pt', 'google', 'gbp', 'facebook', 'instagram', 'referral', 'newsletter'],
  utm_medium: ['directory', 'referral', 'organic', 'social', 'organic_social', 'email', 'cpc'],
  utm_campaign: ['profile_link', 'profile', 'pt-profile', 'launch', 'fall-2026', 'october-2026', 'social-october-2026', 'referral-outreach'],
};
export const publicPaths = ['/', '/booking/', '/how-it-works/', '/pricing/', '/faq/', '/about/', '/contact/', '/privacy/', '/adhd-assessment-for-teens/', '/adhd-assessment-for-adults/', '/adhd-assessment-louisville-ky/'];
/** @param {unknown} input @returns {Record<string, string>} */
export function cleanAttribution(input) {
  /** @type {Record<string, string>} */
  const result = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return result;
  for (const [key, values] of Object.entries(utmCodes)) {
    const value = /** @type {Record<string, unknown>} */ (input)[key];
    if (typeof value === 'string' && values.includes(value)) result[key] = value;
  }
  return result;
}
