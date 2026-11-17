'use strict';
(() => {
  const parse = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
  };
  const iso = date => date.toISOString().slice(0, 10);
  const locale = language => language.startsWith('zh') ? 'zh-CN' : 'en-US';
  const formatDate = (value, language = 'en', options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) => {
    const date = parse(value);
    return date ? new Intl.DateTimeFormat(locale(language), { ...options, timeZone: 'UTC' }).format(date) : '';
  };
  const within = (value, min, max) => !!parse(value) && (!parse(min) || value >= min) && (!parse(max) || value <= max);
  const shiftDay = (value, amount) => { const date = parse(value); if (!date) return ''; date.setUTCDate(date.getUTCDate() + amount); return iso(date); };
  const shiftMonth = (value, amount) => { const date = parse(value); if (!date) return ''; date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + amount); return iso(date); };
  function monthDays(value) {
    const date = parse(value);
    if (!date) return [];
    date.setUTCDate(1); date.setUTCDate(1 - date.getUTCDay());
    return Array.from({ length: 42 }, (_, index) => shiftDay(iso(date), index));
  }
  if (typeof module !== 'undefined') module.exports = { formatDate, within, shiftDay, shiftMonth, monthDays };
  if (typeof document === 'undefined') return;
  const element = id => document.getElementById(id);
  const input = element('date'), trigger = element('date-trigger'), dialog = element('date-dialog');
  let visibleMonth = '';
  const language = () => document.documentElement.lang || 'en';
  const today = () => {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-');
  };
  const canMonth = value => {
    const first = value.slice(0, 7) + '-01';
    const last = shiftDay(shiftMonth(first, 1), -1);
    return (!parse(input.min) || last >= input.min) && (!parse(input.max) || first <= input.max);
  };
  function refresh() {
    const value = formatDate(input.value, language());
    element('date-display').textContent = value || (language().startsWith('zh') ? '请选择日期' : 'Select a date');
    if (dialog.open) render();
  }
  function choose(value) {
    if (!within(value, input.min, input.max)) return;
    input.value = value;
    refresh(); dialog.close(); input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function render() {
    const focused = document.activeElement?.dataset?.date;
    const lang = language();
    const currentToday = today();
    element('date-month').textContent = formatDate(visibleMonth, lang, { year: 'numeric', month: 'long' });
    element('date-weekdays').replaceChildren(...Array.from({ length: 7 }, (_, index) => {
      const label = document.createElement('span');
      label.textContent = formatDate(shiftDay('2026-11-15', index), lang, { weekday: 'short' });
      return label;
    }));
    const dates = monthDays(visibleMonth);
    const tabStop = dates.includes(focused) ? focused : dates.includes(input.value) && within(input.value, input.min, input.max) ? input.value : dates.find(value => within(value, input.min, input.max));
    element('date-days').replaceChildren(...dates.map(value => {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.date = value;
      button.textContent = String(Number(value.slice(-2)));
      button.setAttribute('aria-label', formatDate(value, lang, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }));
      button.setAttribute('aria-pressed', String(value === input.value));
      button.disabled = !within(value, input.min, input.max);
      button.tabIndex = value === tabStop ? 0 : -1;
      if (value.slice(0, 7) !== visibleMonth.slice(0, 7)) button.classList.add('adjacent-date');
      if (value === currentToday) { button.classList.add('today-date'); button.setAttribute('aria-current', 'date'); }
      button.addEventListener('click', () => choose(value));
      return button;
    }));
    element('date-previous').disabled = !canMonth(shiftMonth(visibleMonth, -1));
    element('date-next').disabled = !canMonth(shiftMonth(visibleMonth, 1));
    element('date-today').disabled = !within(today(), input.min, input.max);
    if (focused) element('date-days').querySelector(`[data-date="${focused}"]`)?.focus();
  }
  trigger.addEventListener('click', () => {
    visibleMonth = (parse(input.value) ? input.value : input.min || today()).slice(0, 7) + '-01';
    dialog.showModal(); trigger.setAttribute('aria-expanded', 'true'); render();
    (element('date-days').querySelector('[aria-pressed="true"]:not(:disabled)') || element('date-days').querySelector('button:not(:disabled)'))?.focus();
  });
  for (const [id, amount] of [['date-previous', -1], ['date-next', 1]]) element(id).addEventListener('click', () => { visibleMonth = shiftMonth(visibleMonth, amount); render(); });
  element('date-close').addEventListener('click', () => dialog.close());
  element('date-today').addEventListener('click', () => choose(today()));
  dialog.addEventListener('close', () => { trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  input.addEventListener('change', refresh);
  document.addEventListener('booking-language-change', refresh);
  element('date-days').addEventListener('keydown', event => {
    const value = event.target.dataset.date;
    if (!value) return;
    const amount = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    let next = amount ? shiftDay(value, amount) : '';
    if (event.key === 'Home') next = shiftDay(value, -parse(value).getUTCDay());
    if (event.key === 'End') next = shiftDay(value, 6 - parse(value).getUTCDay());
    if (event.key === 'PageUp' || event.key === 'PageDown') next = shiftMonth(value, event.key === 'PageUp' ? -1 : 1);
    if (!next) return;
    event.preventDefault();
    if (!within(next, input.min, input.max)) return;
    visibleMonth = next.slice(0, 7) + '-01'; render();
    element('date-days').querySelector(`[data-date="${next}"]`)?.focus();
  });
  window.BookingDatePicker = { refresh, close: () => { if (dialog.open) dialog.close(); } };
  refresh();
})();
