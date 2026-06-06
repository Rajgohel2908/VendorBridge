export const roles = {
  ADMIN: 'ADMIN',
  PROCUREMENT_OFFICER: 'PROCUREMENT_OFFICER',
  MANAGER: 'MANAGER',
  VENDOR: 'VENDOR',
};

export function canAccess(userRole, allowedRoles = []) {
  return allowedRoles.includes(userRole);
}
