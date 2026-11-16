'use strict';
const element = id => document.getElementById(id);
const shop = new URLSearchParams(location.search).get('shop') || '7629297118';
document.querySelector('.brand').href = `/3628/book/?shop=${encodeURIComponent(shop)}`;
const base = `/qingji/v1/public-booking/${encodeURIComponent(shop)}`;
let catalog;
let service;
let selectedSlot;
let slotsEpoch = 0;
let submitting = false;
let requestId = crypto.randomUUID();
let previousPayload = '';
let customerCredential = '';
let customerName = '';
const accessDialog = element('access-dialog');
accessDialog.removeAttribute('open');
accessDialog.showModal();
accessDialog.addEventListener('cancel', event => event.preventDefault());
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const timeLabel = instant => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).format(instant);
async function api(path, payload) {
  const credential = customerCredential;
  const response = await fetch(base + path, { method: payload ? 'POST' : 'GET', headers: { ...(payload ? { 'Content-Type': 'application/json' } : {}), 'X-Booking-Customer-ID': customerCredential }, body: payload ? JSON.stringify(payload) : undefined, cache: 'no-store', credentials: 'omit' });
  let data;
  try { data = await response.json(); }
  catch { throw new Error('Connection unavailable. Please try again.'); }
  if (response.status === 401 && credential === customerCredential && !accessDialog.open) lockAccess();
  if (!response.ok) throw Object.assign(new Error(data.error || 'Please try again.'), { status: response.status });
  return data;
}
function summary() {
  element('submit').disabled = !service || !selectedSlot || submitting;
  element('summary').textContent = service && selectedSlot ? `${service.name} · ${money(service.priceCents)}\n${element('date').value} · ${timeLabel(selectedSlot.startsAt)} – ${timeLabel(selectedSlot.endsAt)} (New York)` : 'Choose a service and time to continue.';
}
async function loadSlots(preserve = false) {
  const epoch = ++slotsEpoch;
  const oldSlot = preserve ? selectedSlot : undefined;
  selectedSlot = undefined;
  element('slots').replaceChildren();
  element('availability').textContent = 'Checking availability…';
  summary();
  if (!service || !element('date').value) return;
  try {
    const result = await api(`/slots?serviceId=${encodeURIComponent(service.id)}&date=${encodeURIComponent(element('date').value)}`);
    if (epoch !== slotsEpoch) return;
    element('availability').textContent = result.slots.length ? 'Choose a start time. Availability is checked again when you confirm.' : 'No available times on this date. Please choose another day. The shop may be closed or fully booked.';
    for (const slot of result.slots) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = timeLabel(slot.startsAt); button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        if (submitting) return;
        selectedSlot = slot;
        for (const other of element('slots').children) { other.classList.remove('selected'); other.setAttribute('aria-pressed', 'false'); }
        button.classList.add('selected'); button.setAttribute('aria-pressed', 'true'); summary();
      });
      element('slots').append(button);
      if (oldSlot?.startsAt === slot.startsAt) { selectedSlot = slot; button.classList.add('selected'); button.setAttribute('aria-pressed', 'true'); }
    }
    summary();
  } catch (error) { if (epoch === slotsEpoch) element('availability').textContent = error.message; }
}
element('date').addEventListener('change', () => void loadSlots());
element('booking-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || !service || !selectedSlot) return;
  if (element('website').value) return;
  if (!/^[+\d() .-]{7,30}$/.test(element('phone').value) || element('phone').value.replace(/\D/g, '').length < 7) { element('message').textContent = 'Please enter a valid phone number.'; return; }
  const payload = { serviceId: service.id, startsAt: selectedSlot.startsAt, email: element('email').value.trim(), phone: element('phone').value.trim(), notes: element('notes').value.trim(), expectedPriceCents: service.priceCents, expectedDurationMinutes: service.durationMinutes };
  const serialized = JSON.stringify(payload);
  if (previousPayload && previousPayload !== serialized) requestId = crypto.randomUUID();
  previousPayload = serialized;
  submitting = true; element('fields').disabled = true; element('message').textContent = 'Confirming your appointment…'; summary();
  try {
    const result = await api('/appointments', { ...payload, requestId });
    element('booking').hidden = true; element('success').hidden = false; element('message').textContent = '';
    element('confirmation').textContent = `${result.customerName || customerName}\n${result.serviceName} · ${money(result.priceCents)}\n${element('date').value}\n${timeLabel(result.startsAt)} – ${timeLabel(result.endsAt)} · New York\nStatus: ${result.status}`;
    element('reference').textContent = `Confirmation: ${result.reference}`;
    element('email-status').textContent = result.emailStatus === 'sent' ? 'Your confirmation email has been submitted to the mail server. Please check your inbox and spam folder.' : result.emailStatus === 'queued' ? 'Your booking is confirmed. Your confirmation email is queued for sending.' : result.emailStatus === 'failed' ? 'Your booking is confirmed, but the confirmation email could not be sent. Please save this confirmation.' : 'Your booking is confirmed. The shop has not connected email sending yet; no email has been sent. Please save this confirmation.';
    element('email').value = ''; element('phone').value = ''; element('notes').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    element('message').textContent = error.status ? error.message : 'Connection interrupted. Your appointment may already be confirmed. Retry without changing your details to avoid a duplicate.';
    if (error.status === 409) await loadSlots();
  } finally { submitting = false; element('fields').disabled = false; summary(); }
});
element('another').addEventListener('click', () => {
  element('booking').hidden = false; element('success').hidden = true; element('confirmation').textContent = ''; element('reference').textContent = '';
  requestId = crypto.randomUUID(); previousPayload = ''; void loadSlots();
});
async function initialize(preloaded) {
  try {
    catalog = preloaded || await api('/catalog');
    element('services').replaceChildren();
    element('date').min = catalog.today;
    const maximum = new Date(`${catalog.today}T12:00:00Z`); maximum.setUTCDate(maximum.getUTCDate() + 90);
    element('date').max = maximum.toISOString().slice(0, 10); element('date').value = catalog.today;
    for (const item of catalog.services) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'service'; button.setAttribute('aria-pressed', 'false');
      const title = document.createElement('span'); title.textContent = item.name;
      const detail = document.createElement('small'); detail.textContent = `${item.durationMinutes} min`; title.append(detail);
      const price = document.createElement('span'); price.textContent = money(item.priceCents); button.append(title, price);
      button.addEventListener('click', () => {
        if (submitting) return;
        service = item;
        for (const other of element('services').children) { other.classList.remove('selected'); other.setAttribute('aria-pressed', 'false'); }
        button.classList.add('selected'); button.setAttribute('aria-pressed', 'true'); void loadSlots();
      });
      element('services').append(button);
    }
    element('fields').disabled = false;
    if (!catalog.services.length) element('message').textContent = 'Online booking is not yet available. Please contact the shop.';
    else element('services').firstElementChild.click();
  } catch (error) { element('message').textContent = 'Online booking is temporarily unavailable. Please contact the shop or try again later.'; throw error; }
}
function lockAccess() {
  customerCredential = ''; slotsEpoch++; service = undefined; selectedSlot = undefined;
  element('fields').disabled = true; element('services').replaceChildren(); element('slots').replaceChildren();
  customerName = ''; element('customer-name').textContent = '';
  element('email').value = ''; element('phone').value = ''; element('notes').value = '';
  element('email-status').textContent = '';
  element('confirmation').textContent = ''; element('reference').textContent = '';
  element('content').hidden = true; element('content').inert = true;
  element('access-error').textContent = 'Please enter a valid customer ID from the shop owner.';
  if (!accessDialog.open) accessDialog.showModal();
}
element('access-form').addEventListener('submit', async event => {
  event.preventDefault(); element('access-submit').disabled = true; element('access-error').textContent = '';
  customerCredential = element('customer-id').value.normalize('NFKC').replace(/[\s-]/g, '').toUpperCase();
  try {
    if (!/^(?:[A-Z0-9]{4,20}|[A-F0-9]{24})$/.test(customerCredential)) throw new Error('Please enter the customer ID provided by your shop.');
    const access = await api('/access', {});
    customerName = access.customerName || 'Customer';
    element('customer-name').textContent = `Booking for ${customerName}`;
    const initialCatalog = await api('/catalog');
    await initialize(initialCatalog);
    element('customer-id').value = ''; accessDialog.close();
    element('content').hidden = false; element('content').inert = false;
    element('booking').hidden = false; element('success').hidden = true;
    element('message').textContent = '';
    requestId = crypto.randomUUID(); previousPayload = '';
  } catch (error) { customerCredential = ''; element('access-error').textContent = error.message; }
  finally { element('access-submit').disabled = false; }
});
window.addEventListener('focus', () => { if (service && !submitting && !element('booking').hidden) void loadSlots(true); });
setInterval(() => { if (document.visibilityState === 'visible' && service && !submitting && !element('booking').hidden) void loadSlots(true); }, 20000);
