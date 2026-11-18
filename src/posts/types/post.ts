// Данные храним в массиве в памяти, поэтому id — обычное число.
// Данные водителя и машины копируются в поездку в момент создания.
import { ObjectId } from 'mongodb';

export type Post = {
  // id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: Date;
};
