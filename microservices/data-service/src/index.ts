import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import os from "os";

import typeDefs from "./typedefs";
import resolvers from "./resolvers";

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());

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
  await new Promise((resolve: any) =>
    httpServer.listen({ port: port }, resolve)
  );
  console.log(
    `server started at http://127.0.0.1:${port + server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);

app.get("/", (req, res) => {
  // render the index template
  res.send("data-service active at port 4000, host: " + os.hostname());
});
