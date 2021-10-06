const { AuthenticationError } = require('apollo-server-express');
const { User } = require("../models");
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		users: async () => {
			return await User.find().populate('savedBooks');
		},

		user: async (parent, {username}) => {
			const foundUser = await User.findOne({username}).populate('savedBooks');

			if (!foundUser) {
				throw new AuthenticationError( 'Cannot find a user with this id!' );
			}

			return foundUser;
		}
	},

	Mutation: {
		createUser: async (parent, { username, email, password }) => {
			const user = await User.create({username, email, password});

			if (!user) {
				throw new AuthenticationError( 'Something is wrong!' );
			}

			const token = signToken(user);
			
			return { token, user };
		}
	}

}

module.exports = resolvers;