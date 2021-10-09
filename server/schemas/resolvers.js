const { AuthenticationError } = require('apollo-server-express');
const { User } = require("../models");
const { signToken } = require('../utils/authGQL');

const resolvers = {
	Query: {
		users: async () => {
			return await User.find().populate('savedBooks');
		},

		// Consider switching this over to user context
		me: async (parent, args, context) => {
			const foundUser = await User.findOne({ _id: context.user._id }).populate('savedBooks');

			if (!foundUser) {
				throw new AuthenticationError( 'Cannot find a user with this id!' );
			}

			return foundUser;
		}
	},

	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({username, email, password});

			if (!user) {
				throw new AuthenticationError( 'Something is wrong!' );
			}

			const token = signToken(user);

			return { token, user };
		},

		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError('No user found with this email address');
			}

			const correctPassword = await user.isCorrectPassword(password);

			if (!correctPassword) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const token = signToken(user);

			return { token, user };
		},

		saveBook: async (parent, { input }, context ) => {
			if (context.user) {
				return User.findOneAndUpdate(
					{_id: context.user._id},
					{ 
						$addToSet: {
							savedBooks: { ...input }
						}
					},
					{
						new: true
					}
				);
			}

			throw new AuthenticationError('You need to be logged in!');
		},

		removeBook: async (parent, { bookId }, context ) => {
			if (context.user) {
				return User.findOneAndUpdate(
					{_id: context.user._id},
					{ 
						$pull: {
							savedBooks: { 
								bookId
							}
						}
					},
					{
						new: true
					}
				);
			}

			throw new AuthenticationError('You need to be logged in!');
		}
	}

}

module.exports = resolvers;