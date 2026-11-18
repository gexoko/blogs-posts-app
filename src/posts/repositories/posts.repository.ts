import { Post } from '../types/post';
import { postCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';

// Репозиторий (DAL) отвечает ТОЛЬКО за доступ к данным поездок в in-memory-хранилище.
export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },

  async update(id: string, post: Omit<Post, 'createdAt'>): Promise<boolean> {
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post },
    );

    return updateResult.matchedCount > 0;
  },

  // Возвращает true, если блог найден и удалён, иначе false.
  async delete(id: string): Promise<boolean> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount > 0;
  },
};
