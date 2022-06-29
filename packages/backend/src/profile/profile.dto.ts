import { Prisma } from '@prisma/client';

export class ProfileData {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}
export class ProfileRO {
  profile: ProfileData;
}

export const profileSelect = (userId: number) => {
  return Prisma.validator<Prisma.UserSelect>()({
    username: true,
    bio: true,
    image: true,
    followedBy: !!userId && {
      where: { followerId: userId },
    },
  });
};

export const profileWrapper = (user) => {
  const { followedBy, ...rest } = user;
  return {
    ...rest,
    following: Array.isArray(followedBy) && !!followedBy.length,
  };
};
