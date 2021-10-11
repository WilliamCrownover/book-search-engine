/* eslint-disable no-console */
const jwt = require( 'jsonwebtoken' );

const expiration = '2h';

module.exports = {
	authMiddleware: function ( { req } ) {
		let token = req.body.token || req.query.token || req.headers.authorization;

		if ( req.headers.authorization ) {
			token = token.split( ' ' ).pop().trim();
		}

		if ( !token ) {
			return req;
		}

		try {
			const { data } = jwt.verify( token, process.env.JWT_SECRET, { maxAge: expiration } );
			req.user = data;
		} catch {
			console.log( 'Invalid token' );
		}

		return req;
	},
	signToken: function ( { email, username, _id } ) {
		const payload = {
			email,
			username,
			_id
		};
		return jwt.sign( { data: payload }, process.env.JWT_SECRET, { expiresIn: expiration } );
	},
};
