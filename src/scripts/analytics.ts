import { practice } from '../lib/practice';
import { bookingUrl, captureAttribution, trackBookingClick } from '../lib/attribution';

captureAttribution();
const handoff = (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href]');
  if (!link || event.defaultPrevented) return;
  const destination = new URL(link.href);
  const portal = new URL(practice.booking);
  if (destination.origin !== portal.origin || destination.pathname !== portal.pathname) return;
  trackBookingClick(link.dataset.bookingService);
  link.href = bookingUrl();
};
document.addEventListener('click', handoff);
document.addEventListener('auxclick', event => { if (event.button === 1) handoff(event); });
