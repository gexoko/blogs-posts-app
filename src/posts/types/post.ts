// Данные храним в массиве в памяти, поэтому id — обычное число.
// Данные водителя и машины копируются в поездку в момент создания.
export type Post = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
};
