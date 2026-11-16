'use strict';
const invitation = new URLSearchParams(location.hash.slice(1)).get('customerId');
if (invitation !== null) history.replaceState(null, '', location.pathname + location.search);
const element = id => document.getElementById(id);
const shop = new URLSearchParams(location.search).get('shop') || '7629297118';
document.querySelector('.brand').href = `/3628/book/?shop=${encodeURIComponent(shop)}`;
const base = `/qingji/v1/public-booking/${encodeURIComponent(shop)}`;
let catalog;
let service;
let selectedSlot;
let slotsEpoch = 0;
let initializationEpoch = 0;
let submitting = false;
let requestId = crypto.randomUUID();
let previousPayload = '';
let customerCredential = '';
let customerName = '';
let editingAppointment;
let upcomingCount = 0;
const accessDialog = element('access-dialog');
const policyDialog = element('policy-dialog');
const cancelDialog = element('cancel-dialog');
let pendingCancellation;
cancelDialog.addEventListener('cancel', event => { if (submitting) event.preventDefault(); });
element('cancel-back').addEventListener('click', () => { if (!submitting) { cancelDialog.close(); pendingCancellation = undefined; } });
element('cancel-confirm').addEventListener('click', () => void cancelAppointment());
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
  element('submit').disabled = !service || !selectedSlot || submitting || (!editingAppointment && upcomingCount >= 3);
  element('submit').textContent = editingAppointment ? 'Save appointment changes ↗' : 'Confirm appointment ↗';
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
    const result = await api(`/slots?serviceId=${encodeURIComponent(service.id)}&date=${encodeURIComponent(element('date').value)}${editingAppointment ? `&appointmentId=${encodeURIComponent(editingAppointment.reference)}` : ''}`);
    if (epoch !== slotsEpoch) return;
    element('availability').textContent = result.slots.length ? 'Appointments start on the hour. Choose a start time; availability is checked again when you confirm.' : 'No available times on this date. Please choose another day. The shop may be closed or fully booked.';
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
element('booking-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!readyToSubmit() || policyDialog.open) return;
  policyDialog.showModal(); element('policy-title').focus();
});
element('policy-back').addEventListener('click', () => policyDialog.close());
element('policy-confirm').addEventListener('click', () => {
  if (!policyDialog.open || submitting) return;
  policyDialog.close(); void submitBooking();
});
function readyToSubmit() {
  if (submitting || !service || !selectedSlot || !customerCredential || (!editingAppointment && upcomingCount >= 3) || element('website').value || !element('booking-form').reportValidity()) return false;
  const phone = element('phone').value.trim();
  if (phone && (!/^[+\d() .-]{7,30}$/.test(phone) || phone.replace(/\D/g, '').length < 7)) { element('message').textContent = 'Please enter a valid phone number.'; return false; }
  return true;
}
async function submitBooking() {
  if (!readyToSubmit()) return;
  const payload = { serviceId: service.id, startsAt: selectedSlot.startsAt, email: element('email').value.trim(), phone: element('phone').value.trim(), notes: element('notes').value.trim(), expectedPriceCents: service.priceCents, expectedDurationMinutes: service.durationMinutes };
  const serialized = JSON.stringify(payload);
  if (previousPayload && previousPayload !== serialized) requestId = crypto.randomUUID();
  previousPayload = serialized;
  submitting = true; element('fields').disabled = true; element('message').textContent = 'Confirming your appointment…'; summary();
  try {
    const result = await api(editingAppointment ? '/change' : '/appointments', { ...payload, requestId, ...(editingAppointment ? { appointmentId: editingAppointment.reference, revision: editingAppointment.revision } : {}) });
    editingAppointment = undefined;
    element('booking').hidden = true; element('success').hidden = false; element('message').textContent = '';
    element('confirmation').textContent = `${result.customerName || customerName}\n${result.serviceName} · ${money(result.priceCents)}\n${element('date').value}\n${timeLabel(result.startsAt)} – ${timeLabel(result.endsAt)} · New York\nStatus: ${result.status}`;
    element('reference').textContent = `Confirmation: ${result.reference}`;
    element('email-status').textContent = result.emailStatus === 'sent' ? 'Your confirmation email has been submitted to the mail server. Please check your inbox and spam folder.' : result.emailStatus === 'queued' ? 'Your booking is confirmed. Your confirmation email is queued for sending.' : result.emailStatus === 'failed' ? 'Your booking is confirmed, but the confirmation email could not be sent. Please save this confirmation.' : 'Your booking is confirmed. The shop has not connected email sending yet; no email has been sent. Please save this confirmation.';
    element('email').value = ''; element('phone').value = ''; element('notes').value = '';
    await refreshAppointments().catch(() => {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    element('message').textContent = error.status ? error.message : 'Connection interrupted. Your appointment may already be confirmed. Retry without changing your details to avoid a duplicate.';
    if (error.status === 409) { await refreshAppointments().catch(() => {}); await loadSlots(); }
  } finally { submitting = false; element('fields').disabled = false; summary(); }
}
function newBooking() {
  if (submitting) return;
  editingAppointment = undefined;
  element('booking-title').textContent = 'Book your next visit.'; element('cancel-edit').hidden = true;
  element('email').value = ''; element('phone').value = ''; element('notes').value = '';
  element('booking').hidden = false; element('success').hidden = true; element('confirmation').textContent = ''; element('reference').textContent = '';
  element('message').textContent = '';
  requestId = crypto.randomUUID(); previousPayload = ''; void initialize(catalog).catch(() => {});
}
element('another').addEventListener('click', newBooking);
element('cancel-edit').addEventListener('click', newBooking);
async function refreshAppointments() {
  const credential = customerCredential;
  const data = await api('/my-appointments');
  if (credential !== customerCredential || !customerCredential) return;
  upcomingCount = data.upcomingCount;
  element('my-bookings').hidden = false;
  element('booking-count').textContent = `${upcomingCount} / 3`;
  element('booking-limit').textContent = upcomingCount >= 3 ? 'Your ID has reached the limit of 3 upcoming appointments. You can change an existing appointment below.' : '';
  element('my-appointments').replaceChildren();
  for (const appointment of data.appointments) {
    const card = document.createElement('div'); card.className = 'my-appointment'; card.dataset.appointmentId = appointment.reference;
    const details = document.createElement('p');
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(appointment.startsAt);
    details.textContent = `${appointment.serviceName} · ${money(appointment.priceCents)}\n${date} · ${timeLabel(appointment.startsAt)} – ${timeLabel(appointment.endsAt)}`;
    const button = document.createElement('button'); button.type = 'button'; button.textContent = appointment.canChange ? 'Change appointment' : 'Changes closed · less than 24 hours'; button.disabled = !appointment.canChange;
    button.addEventListener('click', () => {
      if (submitting) return;
      editingAppointment = appointment; requestId = crypto.randomUUID(); previousPayload = '';
      element('booking-title').textContent = 'Change your appointment.'; element('cancel-edit').hidden = false;
      element('booking').hidden = false; element('success').hidden = true; element('message').textContent = '';
      element('email').value = appointment.email; element('phone').value = appointment.phone; element('notes').value = appointment.notes;
      void initialize().catch(() => {});
      element('booking').scrollIntoView({ behavior: 'smooth' });
    });
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'cancel-appointment';
    cancel.textContent = appointment.canChange ? 'Cancel appointment' : 'Cancellation closed · less than 24 hours'; cancel.disabled = !appointment.canChange;
    cancel.addEventListener('click', () => {
      if (submitting || cancelDialog.open) return;
      pendingCancellation = { appointment, requestId: crypto.randomUUID() };
      element('cancel-details').textContent = details.textContent;
      element('cancel-error').textContent = '';
      cancelDialog.showModal(); element('cancel-title').focus();
    });
    const actions = document.createElement('div'); actions.className = 'appointment-actions'; actions.append(button, cancel);
    card.append(details, actions); element('my-appointments').append(card);
  }
  summary();
}
async function refreshVisible() {
  if (!customerCredential || accessDialog.open || cancelDialog.open || policyDialog.open || submitting) return;
  try { await refreshAppointments(); if (service && !element('booking').hidden) await loadSlots(true); }
  catch { if (customerCredential) element('message').textContent = 'Could not refresh your appointments. Please try again.'; }
}
async function initialize(preloaded) {
  const epoch = ++initializationEpoch;
  service = undefined; selectedSlot = undefined; slotsEpoch++;
  element('fields').disabled = true; summary();
  try {
    const result = preloaded || await api('/catalog');
    if (epoch !== initializationEpoch) return;
    catalog = result;
    element('services').replaceChildren();
    element('date').min = catalog.today;
    const maximum = new Date(`${catalog.today}T12:00:00Z`); maximum.setUTCDate(maximum.getUTCDate() + 90);
    element('date').max = maximum.toISOString().slice(0, 10);
    const editingDate = editingAppointment ? new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(editingAppointment.startsAt) : catalog.today;
    element('date').value = editingDate;
    const services = editingAppointment ? [{ id: editingAppointment.serviceId, name: editingAppointment.serviceName, priceCents: editingAppointment.priceCents, durationMinutes: editingAppointment.durationMinutes }, ...catalog.services.filter(item => item.id !== editingAppointment.serviceId)] : catalog.services;
    for (const item of services) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'service'; button.setAttribute('aria-pressed', 'false');
      const title = document.createElement('span'); title.textContent = item.name;
      const detail = document.createElement('small'); detail.textContent = window.BookingDisplay.serviceDurationLabel(item); title.append(detail);
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
    if (!services.length) element('message').textContent = 'Online booking is not yet available. Please contact the shop.';
    else element('services').firstElementChild.click();
  } catch (error) { if (epoch === initializationEpoch) { element('message').textContent = 'Online booking is temporarily unavailable. Please contact the shop or try again later.'; throw error; } }
}
async function cancelAppointment() {
  if (!pendingCancellation || !cancelDialog.open || submitting || !customerCredential) return;
  const pending = pendingCancellation;
  submitting = true; element('fields').disabled = true; element('cancel-confirm').disabled = true; element('cancel-back').disabled = true;
  element('cancel-error').textContent = 'Cancelling your appointment…'; summary();
  let resetForm = false;
  try {
    const result = await api('/cancel', { appointmentId: pending.appointment.reference, revision: pending.appointment.revision, requestId: pending.requestId });
    if (!customerCredential) return;
    if (result.status !== 'cancelled') throw new Error('Please try again.');
    cancelDialog.close(); pendingCancellation = undefined;
    resetForm = editingAppointment?.reference === pending.appointment.reference || element('reference').textContent.endsWith(pending.appointment.reference);
    for (const card of element('my-appointments').children) if (card.dataset.appointmentId === pending.appointment.reference) card.remove();
    upcomingCount = Math.max(0, upcomingCount - 1); element('booking-count').textContent = `${upcomingCount} / 3`; element('booking-limit').textContent = '';
    await refreshAppointments().catch(() => {});
    element('message').textContent = 'Your appointment has been cancelled. We hope to see you another time.';
  } catch (error) {
    element('cancel-error').textContent = error.status ? error.message : 'Connection interrupted. Your appointment may already be cancelled. Please retry to check.';
  } finally {
    submitting = false; element('fields').disabled = !customerCredential; element('cancel-confirm').disabled = false; element('cancel-back').disabled = false;
    if (customerCredential && resetForm) { newBooking(); element('message').textContent = 'Your appointment has been cancelled. We hope to see you another time.'; }
    else if (customerCredential && !cancelDialog.open && service && !element('booking').hidden) await loadSlots(true);
    summary();
  }
}
function lockAccess() {
  if (policyDialog.open) policyDialog.close();
  if (cancelDialog.open) cancelDialog.close(); pendingCancellation = undefined; initializationEpoch++;
  customerCredential = ''; slotsEpoch++; service = undefined; selectedSlot = undefined;
  element('fields').disabled = true; element('services').replaceChildren(); element('slots').replaceChildren();
  customerName = '';
  editingAppointment = undefined; upcomingCount = 0; element('my-appointments').replaceChildren(); element('my-bookings').hidden = true;
  element('booking-title').textContent = 'Book your next visit.'; element('cancel-edit').hidden = true; element('booking-limit').textContent = '';
  element('email').value = ''; element('phone').value = ''; element('notes').value = '';
  element('email-status').textContent = '';
  element('confirmation').textContent = ''; element('reference').textContent = '';
  element('content').hidden = true; element('content').inert = true;
  element('access-error').textContent = 'Please enter a valid customer ID from the shop owner.';
  if (!accessDialog.open) accessDialog.showModal();
}
let unlocking = false;
async function unlockCustomer(code) {
  if (unlocking) return;
  unlocking = true;
  element('access-submit').disabled = true; element('customer-id').disabled = true; element('access-error').textContent = '';
  customerCredential = code.normalize('NFKC').replace(/[\s-]/g, '').toUpperCase();
  try {
    if (!/^(?:[A-Z0-9_]{4,20}|[A-F0-9]{24})$/.test(customerCredential)) throw new Error('Please enter the customer ID provided by your shop.');
    const access = await api('/access', {});
    customerName = access.customerName || 'Customer';
    const initialCatalog = await api('/catalog');
    await initialize(initialCatalog);
    await refreshAppointments();
    element('customer-id').value = ''; accessDialog.close();
    element('content').hidden = false; element('content').inert = false;
    element('booking').hidden = false; element('success').hidden = true;
    element('message').textContent = '';
    requestId = crypto.randomUUID(); previousPayload = '';
  } catch (error) { customerCredential = ''; element('access-error').textContent = error.message; }
  finally { unlocking = false; element('access-submit').disabled = false; element('customer-id').disabled = false; }
}
element('access-form').addEventListener('submit', event => {
  event.preventDefault(); void unlockCustomer(element('customer-id').value);
});
if (invitation !== null) void unlockCustomer(invitation);
window.addEventListener('focus', () => void refreshVisible());
setInterval(() => { if (document.visibilityState === 'visible') void refreshVisible(); }, 20000);
