import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';

export const db = {
  blogs: <Blog[]>[
    {
      id: 1,
      name: 'Gexodus',
      description: 'bla-bla-bla1',
      websiteUrl: 'https://drive.google.com/gexodus',
    },
    {
      id: 2,
      name: 'Adeptus',
      description: 'dep-dep-dep1',
      websiteUrl: 'https://drive.google.com/adeptus',
    },
    {
      id: 3,
      name: 'Morozov',
      description: 'cold-cold-cold1',
      websiteUrl: 'https://drive.google.com/morozov',
    },
  ],
  posts: <Post[]>[
    {
      id: 4,
      title: 'About what?1',
      shortDescription: 'About everything1',
      content: 'Something-something1',
      blogId: 1,
      blogName: 'AW1',
    },
    {
      id: 5,
      title: 'About what?2',
      shortDescription: 'About everything2',
      content: 'Something-something1',
      blogId: 2,
      blogName: 'AW2',
    },
    {
      id: 6,
      title: 'About what?3',
      shortDescription: 'About everything3',
      content: 'Something-something3',
      blogId: 3,
      blogName: 'AW3',
    },
  ],
};
