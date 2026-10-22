import { db } from '../../db/in-memory.db';
import { BlogViewModel } from '../dto/BlogViewModel';
import { Blog } from '../types/blog';

// Репозиторий (DAL) отвечает ТОЛЬКО за доступ к данным в in-memory-хранилище.
// Он не знает про HTTP и не решает, что делать при "не найдено":
// операции изменения возвращают boolean, а решение о статусе ответа принимает handler.
export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: number): Blog | null {
    // Если ничего не нашли, find вернёт undefined — приводим к null.
    return db.blogs.find((b) => b.id === id) ?? null;
  },

  // Принимает доменные поля без id (id генерируем здесь) и возвращает созданного водителя.
  create(newBlog: Omit<Blog, 'id'>): Blog {
    const lastBlog = db.blogs[db.blogs.length - 1];
    const created: Blog = {
      id: lastBlog ? +lastBlog.id + 1 : 1,
      ...newBlog,
    };

    db.blogs.push(created);
    return created;
  },

  // Принимает доменные поля (без служебного id).
  // Возвращает true, если водитель найден и обновлён, иначе false.
  update(id: number, blog: Omit<Blog, 'id'>): boolean {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      return false;
    }

    // Обновляем поля, сохраняя служебное поле id.
    db.blogs[index] = { ...db.blogs[index], ...blog };
    return true;
  },

  // Возвращает true, если водитель найден и удалён, иначе false.
  delete(id: number): boolean {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      return false;
    }

    db.blogs.splice(index, 1);
    return true;
  },
};
