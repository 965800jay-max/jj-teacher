'use strict';
(() => {
  const phrases = {
    'Confirm email address': '再次确认邮箱',
    'Enter your email again': '请再次输入邮箱',
    'The email addresses do not match. Please check and try again.': '两次输入的邮箱不一致，请核对后重试。',
    'Find us': '店铺地址',
    'Note: There is a massage shop on the ground floor. Take the elevator in the lobby and press 5 to go directly to the fifth floor.': '到店指引：大楼一层是按摩店，大厅有直达电梯，请按 5 层。',
    'To help prevent unauthorized bookings and ensure a smooth experience for all clients, a Customer ID is required. Please contact Kirs to obtain your Customer ID. Thank you for your understanding.': '为减少无效预约并保障每位客户的预约体验，预约前需输入客户 ID。请联系 Kirs 获取您的 Customer ID。感谢您的理解与配合。',
    'To help prevent unauthorized bookings and ensure a smooth experience for all clients, a Customer ID is required. Please contact Jay to obtain your Customer ID. Thank you for your understanding.': '为减少无效预约并保障每位客户的预约体验，预约前需输入客户 ID。请联系 Jay 获取您的 Customer ID。感谢您的理解与配合。',
    'You’ll receive a confirmation email once your appointment is booked.': '预约成功后，您将收到预约确认邮件。',
    'Cancel appointment': '取消预约',
    'Cancellation closed · less than 24 hours': '不可取消 · 距开始不足 24 小时',
    'Cancel this appointment?': '确定取消此预约吗？',
    'Cancellations must be completed at least 24 hours before your appointment. Your time slot will be released once you confirm.': '取消操作须在预约开始前至少 24 小时完成。确认取消后，该时段将释放给其他客人。',
    'Yes, cancel appointment': '确定取消预约',
    'Keep appointment': '保留预约',
    'Cancelling your appointment…': '正在取消您的预约…',
    'Your appointment has been cancelled. We hope to see you another time.': '您的预约已取消，期待下次为您服务。',
    'Connection interrupted. Your appointment may already be cancelled. Please retry to check.': '连接中断，您的预约可能已取消，请重试以核实。',
    'Appointments can only be cancelled at least 24 hours before their start time.': '预约只能在开始前至少 24 小时取消。',
    'Up to 3 upcoming appointments per ID. Changes and cancellations require at least 24 hours’ notice.': '每个 ID 最多可预约 3 个时段。修改或取消均须提前至少 24 小时。',
    'Booking page not found.': '未找到预约页面。',
    'Choose a date within the next 90 days.': '请选择未来 90 天内的日期。',
    'Service is unavailable.': '此服务暂不可用。',
    'Invalid submission ID.': '提交信息无效，请刷新后重试。',
    'Please complete all required fields.': '请填写所有必填内容。',
    'This submission ID has already been used.': '此次提交已处理，请刷新后查看预约。',
    'Each customer ID can have up to 3 upcoming appointments. Please change an existing appointment instead.': '每个客户 ID 最多可保留 3 笔待到店预约，请修改已有预约。',
    'This time is no longer available. Please choose another time.': '该时段已不可预约，请选择其他时间。',
    'Service details have changed. Please reload this page before booking.': '服务信息已更新，请刷新页面后预约。',
    'Appointment not found.': '未找到此预约。',
    'Appointments can only be changed at least 24 hours before their current start time.': '预约只能在开始前至少 24 小时修改。',
    'Please refresh your appointment before changing it.': '请刷新预约后再修改。',
    'This appointment has changed. Please refresh and try again.': '此预约已更新，请刷新后重试。',
    'Please choose a new time at least 24 hours from now.': '请选择距现在至少 24 小时后的新时间。',
    'Your confirmation email is being sent. Please try again shortly.': '确认邮件正在发送，请稍后重试。',
    'Please enter a valid email address.': '请输入有效的电子邮箱。',
    'PRIVATE BOOKING': '专属预约',
    'Enter your customer ID': '请输入您的客户 ID',
    'A private invitation. Your next visit.': '专属邀请，期待您的到来。',
    'Customer ID': '客户 ID',
    'Your customer ID': '请输入客户 ID',
    'Done': '进入预约',
    'APPOINTMENTS': '预约',
    'My appointments': '我的预约',
    'Up to 3 upcoming appointments per ID. Changes require at least 24 hours’ notice.': '每个 ID 最多可预约 3 个时段。如需修改，请至少提前 24 小时。',
    'Book your': '预约您的',
    'next visit.': '下次到店。',
    'Book your next visit.': '预约您的下次到店。',
    'Back to new booking': '返回新增预约',
    'Choose a service and a time that works for you.': '请选择服务和适合您的时间。',
    'Your service': '选择服务',
    'Your time': '选择时间',
    'Your details': '联系方式',
    'Choose a service': '选择服务',
    'Available appointment times': '可预约时段',
    'Date': '日期',
    'Email address': '电子邮箱',
    'Phone number': '手机号码',
    'Notes': '备注',
    '(optional)': '（选填）',
    'Anything you would like us to know?': '有什么需要提前告诉我们的吗？',
    'Leave blank': '请留空',
    'Choose a service and time to continue.': '请选择服务和时间以继续。',
    'Confirm appointment': '确认预约',
    'Confirm appointment ↗': '确认预约 ↗',
    'Save appointment changes ↗': '保存预约修改 ↗',
    'Checking availability…': '正在查询可预约时间…',
    'Appointments start on the hour. Choose a start time; availability is checked again when you confirm.': '预约从整点开始。请选择开始时间，确认时将再次核实时段。',
    'No available times on this date. Please choose another day. The shop may be closed or fully booked.': '当天暂无可预约时段，店铺可能休息或已约满，请选择其他日期。',
    'Please enter a valid phone number.': '请输入有效的手机号码。',
    'Confirming your appointment…': '正在确认您的预约…',
    'Before you confirm': '预约前温馨提示',
    'Please make any changes or cancellations at least': '如需修改或取消预约，请至少在预约开始前',
    '24 hours before your appointment': '24 小时完成操作',
    '. Changes and cancellations are not permitted within 24 hours of your appointment. Thank you for your understanding.': '。距离预约开始不足 24 小时将无法修改或取消，感谢您的理解与配合。',
    'I confirm!': '我确定！',
    'Go back': '返回',
    "YOU'RE ALL SET": '预约已确认',
    'See you soon.': '期待与您见面。',
    'Manage your booking in My appointments above. Changes and cancellations close 24 hours before your appointment.': '可在上方“我的预约”中管理预约。距离预约开始不足 24 小时将无法修改或取消。',
    'Book another appointment': '继续预约',
    '3628 New York · Simple, thoughtful appointments.': '3628 New York · 简单预约，用心服务。',
    'Your ID has reached the limit of 3 upcoming appointments. You can change an existing appointment below.': '您的 ID 已有 3 笔待到店预约。您可以修改下方的已有预约。',
    'Change appointment': '修改预约',
    'Change your appointment.': '修改您的预约。',
    'Changes closed · less than 24 hours': '不可修改 · 距开始不足 24 小时',
    'Could not refresh your appointments. Please try again.': '预约刷新失败，请重试。',
    'Online booking is not yet available. Please contact the shop.': '暂未开放在线预约，请联系店铺。',
    'Online booking is temporarily unavailable. Please contact the shop or try again later.': '在线预约暂时不可用，请联系店铺或稍后重试。',
    'Please enter a valid customer ID from the shop owner.': '请输入店主为您创建的有效客户 ID。',
    'Please enter the customer ID provided by your shop.': '请输入店主提供的客户 ID。',
    'Connection unavailable. Please try again.': '连接暂时不可用，请重试。',
    'Please try again.': '请重试。',
    'Connection interrupted. Your appointment may already be confirmed. Retry without changing your details to avoid a duplicate.': '连接中断，您的预约可能已确认。请保留原信息重试，以免重复预约。',
    'Your confirmation email has been submitted to the mail server. Please check your inbox and spam folder.': '确认邮件已提交至邮件服务器，请检查收件箱及垃圾邮件文件夹。',
    'Your booking is confirmed. Your confirmation email is queued for sending.': '预约已确认，确认邮件正在等待发送。',
    'Your booking is confirmed, but the confirmation email could not be sent. Please save this confirmation.': '预约已确认，但确认邮件发送失败，请保存此确认信息。',
    'Your booking is confirmed. The shop has not connected email sending yet; no email has been sent. Please save this confirmation.': '预约已确认。店铺暂未接通邮件发送，尚未发送邮件，请保存此确认信息。'
  };
  function translate(text) {
    const trimmed = text.trim();
    if (Object.hasOwn(phrases, trimmed)) return text.replace(trimmed, phrases[trimmed]);
    if (/^\d+(?:–\d+)? min$/.test(trimmed)) return text.replace(' min', ' 分钟');
    if (text.startsWith('Confirmation: ')) return text.replace('Confirmation: ', '预约编号：');
    return text.replace(/\(New York\)$/gm, '（纽约时间）').replace(/ · New York$/gm, ' · 纽约时间').replace(/^Status: confirmed$/gm, '状态：已确认');
  }
  if (typeof module !== 'undefined') module.exports = { translate };
  if (typeof document === 'undefined') return;
  let language = 'en';
  const originals = new WeakMap();
  function updateValue(target, key, current, write) {
    const values = originals.get(target) || {};
    const previous = values[key];
    const english = previous && current === previous.shown ? previous.english : current;
    const shown = language === 'en' ? english : translate(english);
    values[key] = { english, shown }; originals.set(target, values);
    if (current !== shown) write(shown);
  }
  const observer = new MutationObserver(render);
  function render() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script, style, .language-toggle')) continue;
      const target = node;
      updateValue(target, 'text', target.nodeValue, value => { target.nodeValue = value; });
    }
    for (const target of document.querySelectorAll('[placeholder], [aria-label]')) {
      if (target.classList.contains('language-toggle')) continue;
      for (const key of ['placeholder', 'aria-label']) {
        if (target.hasAttribute(key)) updateValue(target, key, target.getAttribute(key), value => target.setAttribute(key, value));
      }
    }
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = language === 'en' ? '3628 New York · Book an appointment' : '3628 New York · 在线预约';
    for (const button of document.querySelectorAll('.language-toggle')) {
      button.textContent = language === 'en' ? '中文' : 'English';
      button.setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : 'Switch to English');
    }
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label'] });
  }
  for (const button of document.querySelectorAll('.language-toggle')) button.addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; render(); });
  render();
})();
