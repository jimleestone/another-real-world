import { Prisma } from '@prisma/client';

export class AuthorResponse {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export const authorSelect = (userId: number) => {
  return Prisma.validator<Prisma.UserSelect>()({
    username: true,
    bio: true,
    image: true,
    // when not logged in do not query this field
    followedBy: !!userId && {
      select: { follower: true },
      where: { followerId: userId },
    },
  });
};
