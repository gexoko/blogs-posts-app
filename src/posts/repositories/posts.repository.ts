import { db } from '../../db/in-memory.db';
import { Post } from '../types/post';
import { PostInputModel } from '../dto/PostInputModel';

// Репозиторий (DAL) отвечает ТОЛЬКО за доступ к данным поездок в in-memory-хранилище.
export const postsRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: number): Post | null {
    return db.posts.find((p) => p.id === id) ?? null;
  },

  // Принимает доменные поля без id (id генерируем здесь) и возвращает созданную поездку.
  create(newPost: Omit<Post, 'id'>): Post {
    const lastPost = db.posts[db.posts.length - 1];
    const created: Post = {
      id: lastPost ? lastPost.id + 1 : 1,
      ...newPost,
    };

    db.posts.push(created);
    return created;
  },
  // Принимает доменные поля (без служебного id).
  // Возвращает true, если водитель найден и обновлён, иначе false.
  update(id: number, post: Omit<Post, 'id'>): boolean {
    const index = db.posts.findIndex((b) => b.id === id);

    if (index === -1) {
      return false;
    }

    // Обновляем поля, сохраняя служебное поле id.
    db.posts[index] = { ...db.posts[index], ...post };
    return true;
  },

  // Возвращает true, если водитель найден и удалён, иначе false.
  delete(id: number): boolean {
    const index = db.posts.findIndex((b) => b.id === id);

    if (index === -1) {
      return false;
    }

    db.posts.splice(index, 1);
    return true;
  },
};
