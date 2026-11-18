import { Collection, Db } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';

export const BLOG_COLLECTION_NAME = 'blog';
export const POST_COLLECTION_NAME = 'posts';

// Коллекция инициализируется один раз в initCollections() после подключения к БД.
// До этого момента она undefined, поэтому обращаться к ней можно только после runDB().
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;

// Создаём объект коллекции из подключённой базы.
export function initCollections(db: Db): void {
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
}

export function getAllCollections(): Collection<any>[] {
  return [blogCollection, postCollection];
}
