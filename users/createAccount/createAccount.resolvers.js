import bcrypt from 'bcrypt';

import client from '../../client';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // check if username or email ar already on DB.
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error('This user name/password is already taken.');
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: 'Cant create account.',
        };
      }
    },
  },
};
