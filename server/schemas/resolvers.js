const { User } = require("../models");
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		users: async () => {
			return User.find().populate('savedBooks');
		},

		user: async (parent, {username}) => {
			return User.findOne({username}).populate('savedBooks');
		}
	},

	Mutation: {
		createUser: async (parent, { username, email, password }) => {
			const user = await User.create({username, email, password});
			const token = signToken(user);
			return { token, user };
		}
	}

}

module.exports = resolvers;