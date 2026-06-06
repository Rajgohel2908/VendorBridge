export function canAccess(userRole, allowedRoles) {
  if (!userRole || !allowedRoles) return false;
  return allowedRoles.includes(userRole);
}
