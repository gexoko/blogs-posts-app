import { PostViewModel } from '../../dto/PostViewModel';
import { Post } from '../../types/post';
import { WithId } from 'mongodb';

export const mapPostToResource = (post: WithId<Post>): PostViewModel => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
