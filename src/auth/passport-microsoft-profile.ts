export type PassportMicrosoftProfile = {
  provider: 'microsoft';
  name: { familyName: string; givenName: string };
  id: string;
  displayName: string;
  userPrincipalName: string;
  emails: { type: 'work'; value: string }[];
};
