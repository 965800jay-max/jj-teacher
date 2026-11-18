(function () {
  function normalize(value) {
    const normalized = value.normalize('NFKC').trim().toUpperCase();
    const legacy = normalized.replace(/[\s-]/g, '');
    return /^[A-F0-9]{24}$/.test(legacy) ? legacy : normalized;
  }
  function validText(value) {
    return typeof value === 'string' && value.trim().length > 0 && [...value].length <= 256 && !/[\p{Cc}\p{Cs}\u2028\u2029]/u.test(value);
  }
  const api = { normalize, validText };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.BookingCustomerId = api;
})();
