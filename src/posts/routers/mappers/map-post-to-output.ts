import { PostViewModel } from '../../dto/PostViewModel';
import { Post } from '../../types/post';

export const mapPostToResource = (post: Post): PostViewModel => {
  return {
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
  };
};
