'use strict';
(() => {
  function serviceDurationLabel(service) {
    if (/\bhaircut\b|剪发|剪髮/i.test(service.name)) return '45–60 min';
    if (/\bperm\b|烫发|燙髮/i.test(service.name)) return '90–120 min';
    return `${service.durationMinutes} min`;
  }
  if (typeof module !== 'undefined') module.exports = { serviceDurationLabel };
  if (typeof window !== 'undefined') window.BookingDisplay = { serviceDurationLabel };
})();
