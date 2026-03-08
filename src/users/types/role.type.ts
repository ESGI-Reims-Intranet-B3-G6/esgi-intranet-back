export const RolesList = ['GUEST', 'ETUDIANT', 'INTERVENANT', 'ADMIN', 'SUPERADMIN'] as const;
export type Role = (typeof RolesList)[number];

export function rolePriority(role: Role) {
  switch (role) {
    case 'GUEST':
      return 0;
    case 'ETUDIANT':
      return 1;
    case 'INTERVENANT':
      return 2;
    case 'ADMIN':
      return 3;
    case 'SUPERADMIN':
      return 4;
  }
}

export function isHigherPriority(currentRole: Role, targetRole: Role) {
  return rolePriority(currentRole) < rolePriority(targetRole);
}

export function isLowerPriority(currentRole: Role, targetRole: Role) {
  return rolePriority(currentRole) > rolePriority(targetRole);
}

export function isEqualPriority(currentRole: Role, targetRole: Role) {
  return rolePriority(currentRole) === rolePriority(targetRole);
}
