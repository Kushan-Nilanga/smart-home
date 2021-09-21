import { gql } from "apollo-server-core";

const out = gql`
  type State {
    id: ID!
    updated: String
    health: String
    state: String
  }

  type Device {
    _id: ID
    uuid: String!
    state: [State]
  }

  type User {
    id: ID!
    email: String
    pass: String
    devices: [Device]
  }

  type Query {
    userid(user_id: ID!): User
    user(email: String!, pass: String!): User
  }

  type Mutation {
    createUser(email: String!, pass: String!): User
    createDevice(user_id: ID!, uuid: String!): String
    removeDevice(user_id: ID!, device_id: ID!): String!
  }
`;

export = out;
