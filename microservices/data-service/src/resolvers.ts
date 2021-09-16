import Device from "./device";

export = {
  Query: {
    // getting device information
    // devices: async (parent, args: any, context, info) => {
    devices: async (parent: any, args: any, context: any, info: any) => {
      const { id, ids } = args;
      if (ids !== undefined) {
        return await Device.find().where("_id").in(ids).exec();
      }
      if (!undefined === id) return await Device.find({ id });
      return await Device.find();
    },
  },

  Mutation: {
    // create new device
    createDevice: async (_: any, { name }: any) => {
      const dev = new Device({ name });
      await dev.save();
      return dev;
    },

    // remove 1 device
    removeDevice: async (parent: any, args: any, context: any, info: any) => {
      const { id } = args;
      if (id === undefined) return;
      await Device.findByIdAndDelete(id);
      return id;
    },

    // remove devices
    removeDevices: async (parent: any, args: any, context: any, info: any) => {
      const { ids } = args;
      if (ids === undefined) return;
      await Device.deleteMany().where("_id").in(ids).exec();
      return ids;
    },

    // push data to database
    addData: async (parent: any, args: any, context: any, info: any) => {
      const { id, value } = args;
      const date = new Date();
      if (id === undefined) return;
      return Device.updateOne(
        { _id: id },
        {
          $push: {
            state: {
              value: value,
              updated: date,
            },
          },
        }
      ).then((data: any) => {
        return data;
      });
    },
  },
};
