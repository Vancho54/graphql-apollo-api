const express = require ('express')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const dotEnv = require('dotenv')
const resolvers = require("./resolvers")
const typeDefs = require('./typeDef')
const { connection } = require('./database/util')
const { verifyUser } = require('./helper/context')
const { verify } = require('jsonwebtoken')
const DataLoader = require('dataloader')
const loaders = require('./loaders')

dotEnv.config();

const app = express();

app.use(cors())

app.use(express.json())

connection()

const apolloserver = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
        const contextObj = {};
        if (req) {
            await verifyUser(req)
            contextObj.email = req.email
            contextObj.loggedInUserId = req.loggedInUserId
        }
            contextObj.loaders = {
                user: new DataLoader(keys => loaders.user.batchUser(keys))
            }
        return contextObj
    }
});

apolloserver.applyMiddleware({app, path: '/graphql'})

const PORT = process.env.PORT || 3000

app.use('/', (req, res, next) => {
    res.send({message: 'hello'})
})

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}` );
    console.log(`Graphql Endpoint: ${apolloserver.graphqlPath}`);
})

apolloserver.installSubscriptionHandlers(httpServer)