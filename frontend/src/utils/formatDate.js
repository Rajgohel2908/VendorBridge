export function formatDate(value) {
  return value ? new Intl.DateTimeFormat('en-US').format(new Date(value)) : '';
}
