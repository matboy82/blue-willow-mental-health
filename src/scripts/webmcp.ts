import { practice } from '../lib/practice';
import { bookingUrl, captureAttribution, trackBookingClick } from '../lib/attribution';

type WebMcpRegistry = {
  registerTool(
    tool: {
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      execute(input: unknown): unknown | Promise<unknown>;
    },
    options?: { signal?: AbortSignal },
  ): void | Promise<void>;
};

type ModelContextDocument = Document & { readonly modelContext?: WebMcpRegistry };

const registry = (document as ModelContextDocument).modelContext;
if (typeof registry?.registerTool === 'function') {
  const lifecycle = new AbortController();
  const serviceDetails = {
    'initial-assessment': { label: 'Initial ADHD assessment', price: '$225' },
    'follow-up': { label: 'Follow-up visit', price: '$100' },
  } as const;
  const serviceSchema = {
    type: 'string',
    enum: Object.keys(serviceDetails),
    description: 'The public appointment type the visitor wants to request.',
  };
  const readService = (input: unknown) => {
    if (!input || typeof input !== 'object' || !('service' in input)) throw new Error('Choose initial-assessment or follow-up.');
    const service = (input as { service?: unknown }).service;
    if (typeof service !== 'string' || !(service in serviceDetails)) throw new Error('Choose initial-assessment or follow-up.');
    return service as keyof typeof serviceDetails;
  };
  const register = (tool: Parameters<WebMcpRegistry['registerTool']>[0]) => {
    try { void Promise.resolve(registry.registerTool(tool, { signal: lifecycle.signal })); } catch { /* progressive enhancement */ }
  };

  register({
    name: 'get_public_practice_info',
    description: 'Read public Blue Willow Mental Health services, pricing, coverage area, and secure contact links.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    execute() {
      return {
        name: practice.name,
        serviceArea: 'Kentucky by telehealth; rooted in Louisville, Kentucky',
        services: Object.entries(serviceDetails).map(([id, details]) => ({ id, ...details })),
        bookingUrl: practice.booking,
        contactUrl: practice.contact,
        phone: practice.phone,
        email: practice.email,
        privacy: 'Clinical intake, scheduling, and patient information stay in SimplePractice.',
      };
    },
  });

  register({
    name: 'open_booking_flow',
    description: 'Open the secure SimplePractice booking portal for a selected public appointment type.',
    inputSchema: { type: 'object', properties: { service: serviceSchema }, required: ['service'], additionalProperties: false },
    execute(input: unknown) {
      const service = readService(input);
      captureAttribution();
      trackBookingClick(service, 'webmcp');
      const url = bookingUrl();
      window.setTimeout(() => window.location.assign(url), 0);
      return { status: 'opened', service, ...serviceDetails[service], url };
    },
  });

  register({
    name: 'open_secure_contact',
    description: 'Open the secure SimplePractice contact flow for a general practice question.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    execute() {
      window.setTimeout(() => window.location.assign(practice.contact), 0);
      return { status: 'opened', url: practice.contact };
    },
  });

  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}
