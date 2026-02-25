export const RolesList = ['ETUDIANT', 'INTERVENANT', 'ADMIN', 'SUPERADMIN'] as const;
export type Role = (typeof RolesList)[number];
