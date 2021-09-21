import { model, Schema, Model, Document, Mongoose } from "mongoose";
import mongoose from "mongoose";
// --------------------DEVICE-----------------------------
// interface IDevice {
//   uuid: string;
//   state: [
//     {
//       updated: string;
//       state: string;
//       health: string;
//     }
//   ];
// }

const DeviceSchema: Schema = new Schema({
  uuid: { type: String },
  state: [
    {
      updated: { type: String },
      state: { type: String },
      health: { type: String },
    },
  ],
});

// const Device: Model<IDevice> = model("Device", DeviceSchema);
const Device: any = model("Device", DeviceSchema);

// ---------------------USER-------------------------------
// interface IUser {
//   email: string;
//   pass: string;
//   devices: [typeof Device];
// }

const UserSchema: Schema = new Schema({
  email: { type: String },
  pass: { type: String },
  devices: [],
});

// const User: Model<IUser> = model("User", UserSchema);
const User: any = model("User", UserSchema);

export { User, Device };
