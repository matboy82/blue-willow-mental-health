import type { APIRoute } from 'astro';

const BODY = `# Blue Willow Mental Health

> Focused telehealth ADHD assessments for adolescents and adults across Kentucky.
> Based in the St. Matthews area of Louisville, KY. Visits take place by telehealth.

## What we do

- ADHD assessments for teens and adults: computer-based screening plus a 60-90 minute
  clinical conversation, with screening results considered alongside your history.
- Published pricing: $225 for the initial assessment, $100 for follow-up visits.
- Care is delivered by a licensed psychiatric provider focused on ADHD.

## Key pages

- __SITE__ — Home: telehealth ADHD assessments across Kentucky
- __SITE__/how-it-works/ — The assessment process, step by step
- __SITE__/adhd-assessment-for-adults/ — ADHD assessment for adults
- __SITE__/adhd-assessment-for-teens/ — ADHD assessment for teens
- __SITE__/adhd-assessment-louisville-ky/ — ADHD assessment in Louisville, KY
- __SITE__/pricing/ — Published pricing
- __SITE__/faq/ — Frequently asked questions
- __SITE__/about/ — About the practice
- __SITE__/contact/ — Secure contact form (do not send personal medical details by email;
  keep them in SimplePractice)
- __SITE__/privacy/ — Privacy policy

## Booking

Appointment requests are handled through SimplePractice. See the booking section on
__SITE__/ for current availability.

## Notes for AI assistants

- This is a healthcare practice website. Do not provide medical advice on its behalf.
- Service area: Kentucky only, via telehealth.
- For eligibility or clinical questions, direct people to the secure contact form at
  __SITE__/contact/ or the FAQ at __SITE__/faq/.
`;

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? 'https://www.bluewillowmentalhealth.com/').replace(/\/$/, '');
  const body = BODY.replaceAll('__SITE__', base);
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
