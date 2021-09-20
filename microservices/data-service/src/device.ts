import { model, Schema, Model, Document } from "mongoose";

interface IDevice {
  name: string;
  state: [
    {
      updated: Date;
      value: string;
    }
  ];
}

const DeviceSchema: Schema = new Schema({
  name: { type: String },
  state: [
    {
      updated: { type: Date },
      value: { type: String },
    },
  ],
});

const Device: Model<IDevice> = model("Device", DeviceSchema);

export = Device;
