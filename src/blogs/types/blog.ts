// Данные храним в массиве в памяти, поэтому id — обычное число.
// Данные водителя и машины копируются в поездку в момент создания.
export type Blog = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership?: boolean;
};
