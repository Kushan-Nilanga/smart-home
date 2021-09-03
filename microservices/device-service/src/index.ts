import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import typeDefs from "./gql/typedefs";
import resolvers from "./gql/resolvers";
import os from 'os'
var port = process.env.PORT;

const app = express();

async function startApolloServer(typeDefs: any, resolvers: any) {
    await mongoose.connect(
        "mongodb+srv://root:toor@sit314.g7vp8.mongodb.net/test?retryWrites=true&w=majority"
    );
    
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpServer.listen({ port: port }, resolve));
    console.log(
        `server started at http://l127.0.0.1:${port+server.graphqlPath}`
    );
}



startApolloServer(typeDefs, resolvers);

app.get( "/", ( req, res ) => {
    // render the index template
    res.send( "device-service active, host: " + os.hostname() );
} );
