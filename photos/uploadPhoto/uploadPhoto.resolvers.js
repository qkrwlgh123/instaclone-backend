import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          // parse caption
          hashtagObj = processHashtags(caption);
          console.log(hashtagObj);
          // get or create Hashtags
          return client.photo.create({
            data: {
              file,
              caption,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              ...(hashtagObj.length > 0 && {
                hashtags: {
                  connectOrCreate: hashtagObj,
                },
              }),
            },
          });
        }
        // save the photo WITH the parsed hashtags
        // add the photo to the hashtags
      }
    ),
  },
};
