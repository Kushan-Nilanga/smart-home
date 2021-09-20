import { model, Schema, Model, Document } from "mongoose";

interface IUser {
  email: string;
  pass: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String },
  pass: { type: String },
});

const User: Model<IUser> = model("User", UserSchema);

export = User;
