(function () {
  function priceOnDate(service, date) {
    let price = service.priceCents;
    let effective = '';
    for (const rule of service.priceSchedule || []) {
      if (rule.effectiveOn <= date && rule.effectiveOn > effective) { price = rule.priceCents; effective = rule.effectiveOn; }
    }
    return price;
  }
  const api = { priceOnDate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.BookingPricing = api;
})();
