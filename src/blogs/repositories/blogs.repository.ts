import { Blog } from '../types/blog';
import { ObjectId, WithId } from 'mongodb';
import { blogCollection } from '../../db/collections';

// Репозиторий отвечает ТОЛЬКО за доступ к данным (CRUD).
// Он не знает про HTTP и не решает, что делать при "не найдено":
// операции изменения возвращают boolean, а решение о статусе ответа принимает handler.
export const blogsRepository = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  },

  // Принимает уже готовый доменный объект (без createdAt) — маппинг из DTO делает handler.
  // Возвращает true, если водитель найден и обновлён, иначе false.
  async update(id: string, blog: Omit<Blog, 'createdAt'>): Promise<boolean> {
    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: blog },
    );

    return updateResult.matchedCount > 0;
  },

  // Возвращает true, если блог найден и удалён, иначе false.
  async delete(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount > 0;
  },
};
