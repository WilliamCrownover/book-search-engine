const express = require('express');
// Adding apollo server
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
// Adding schema files and authMiddleware
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/authGQL');

const db = require('./config/connection');

// THIS WILL BE REMOVED!
// const routes = require('./routes');
// THIS WILL BE REMOVED!

const app = express();
const PORT = process.env.PORT || 3001;

// Define the server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Adding the applyMiddleware line
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// THIS WILL BE REMOVED!
// app.use(routes);
// THIS WILL BE REMOVED!

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
