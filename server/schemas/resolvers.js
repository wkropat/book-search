const {Book, User} = require('../models');
//resolvers.js: Define the query and mutation functionality to work with the Mongoose models.

const resolvers = {
    Query: {
        me: async (context) => {
            return User.findOne({_id:context.user._id})
        }

    },
    Mutation: {
        login: async ({email, password}) => {
            // Find one user where email
            const user = await User.findOne({email})
            // CHeck against password
            const newPW = await User.isCorrectPassword(password)
            if (newPW) {
                const token = signToken(user)
                return {token, user}
            }
            // return the user/tokemn
        },
        createUser: async (args) => {
            const user = await User.create(args)
            const token = signToken(user);
            return { token, user };

        },
        saveBook: async ({bookData}, context) => {
            const updateUser = await User.findOneAndUpdate({_id:context.user._id}, {$push: {savedBooks:bookData}});
            return updateUser;
        },
        deleteBook: async ({bookID}, context) => {
            const updateUser = await User.findOneAndUpdate({_id:context.user._id}, {$pull: {savedBooks:{bookID}}});
            return updateUser;
        }
    }
}
module.exports = resolvers;