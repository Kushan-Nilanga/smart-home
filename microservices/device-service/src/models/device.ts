import { model, Schema, Model, Document } from "mongoose";

interface IDevice {
    name: string;
    state: [
        {
            updated: Date;
            connection: string;
            value: string;
        }
    ];
}

const DeviceSchema: Schema = new Schema({
    name: { type: String },
    state: [
        {
            updated: { type: Date },
            connection: { type: String },
            value: { type: String },
        },
    ],
});

const Device: Model<IDevice> = model("User", DeviceSchema);

export = Device;
