import { gql } from "apollo-server-core";

const out = gql`
  type State {
    id: ID
    updated: String
    health: String
    state: String
  }

  type Device {
    _id: ID
    uuid: String
    state: [State]
  }

  type User {
    id: ID!
    email: String
    pass: String
    devices: [Device]
  }

  type Id {
    _id: ID!
  }

  type Query {
    deviceids(user_id: String): [Id]
    userid(user_id: ID!): User
    user(email: String!, pass: String!): User
  }

  type Mutation {
    createUser(email: String!, pass: String!): User
    createDevice(user_id: ID!, uuid: String!): String
    removeDevice(user_id: ID!, device_id: ID!): String
    addData(
      user_id: ID!
      device_id: ID!
      state: String
      health: String
      updated: String!
    ): String
    addHealth(device_id: String!, health: String!): String
  }
`;

export = out;
