import { gql } from '@apollo/client';

export const LOGIN_USER = gql `
	mutation login( $email: String!, $password: String!) {
		login( email: $email, password: $password) {
			token
			user {
				_id
				username
				email
				bookCount
				savedBooks {
					authors
					description
					bookId
					image
					link
					title
				}
			}
		}
	}
`;