import client from '../../client';

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      // User Checking
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      // First method(Offset pagination)
      const followers = await client.user
        .findUnique({
          where: {
            username,
          },
        })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
      // Second method(Offset pagination)
      //   const bFollowers = await client.user.findMany({
      //     where: {
      //       following: {
      //         some: {
      //           username,
      //         },
      //       },
      //     },
      //   });
      //   console.log(bFollowers[0]);
    },
  },
};
