import Device from "./device";

export = {
    Query: {
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
        createDevice: async (_: any, { name }: any) => {
            const dev = new Device({ name });
            await dev.save();
            return dev;
        },

        removeDevice: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            const { id } = args;
            if (id === undefined) return;
            await Device.findByIdAndDelete(id);
            return id;
        },

        removeDevices: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            const { ids } = args;
            if (ids === undefined) return;
            await Device.deleteMany().where("_id").in(ids).exec();
            return ids;
        },

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
