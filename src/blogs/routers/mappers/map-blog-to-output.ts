import { BlogViewModel } from '../../dto/BlogViewModel';
import { Blog } from '../../types/blog';
import { WithId } from 'mongodb';

// Превращает блог из БД в JSON:API-ресурс: числовой id -> строку,
// Используется и для одного блога, и для списка.
export const mapBlogToResource = (blog: WithId<Blog>): BlogViewModel => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership ?? false,
  };
};
