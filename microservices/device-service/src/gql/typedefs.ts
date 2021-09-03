import { gql } from "apollo-server-core";

const out = gql`
    type UpdateResult {
        acknowledged: Boolean
        modifiedCount: Int
        upsertedId: ID
        upsertedCount: Int
        matchedCount: Int
    }

    type State {
        updated: String
        connection: String
        value: String
    }

    type Device {
        _id: ID!
        name: String
        state: [State]
    }

    type Query {
        devices(id: ID, ids: [ID]): [Device]
    }

    type Mutation {
        createDevice(name: String): Device!
        removeDevice(id: ID!): ID
        removeDevices(ids: [ID]!): [ID]
        addData(id: ID!, connection: String!, value: String!): UpdateResult
    }
`;

export = out;
