export function formatPrice(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export function generateSessionId() {
  return 'sess-' + Math.random().toString(36).substring(2, 10);
}

export function getSessionId() {
  let id = localStorage.getItem('tmf-session');
  if (!id) {
    id = generateSessionId();
    localStorage.setItem('tmf-session', id);
  }
  return id;
}

