import { BlogViewModel } from '../../dto/BlogViewModel';
import { Blog } from '../../types/blog';

// Превращает блог из БД в JSON:API-ресурс: числовой id -> строку,
// Используется и для одного блога, и для списка.
export const mapBlogToResource = (blog: Blog): BlogViewModel => {
  return {
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
  };
};
