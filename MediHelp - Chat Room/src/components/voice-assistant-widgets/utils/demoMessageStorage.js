// PATH: components/voice-assistant-widgets/utils/demoMessageStorage.js

export function getUserMessageCount() {
  return Number(sessionStorage.getItem('guestMessageCount') || 0);
}

export function incrementUserMessageCount() {
  const count = getUserMessageCount() + 1;
  sessionStorage.setItem('guestMessageCount', count);
  return count;
}

export function resetUserMessageCount() {
  sessionStorage.removeItem('guestMessageCount');
}