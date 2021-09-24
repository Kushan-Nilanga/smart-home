import { ObjectId } from "bson";
import { User, Device } from "./models/user";

export = {
  Query: {
    //----------------------------------------------------------------------
    // USER
    userid: async (parent: any, args: any, context: any, info: any) => {
      const { user_id } = args;
      const usr = await User.findById(user_id);
      return usr;
    },
    user: async (parent: any, args: any, context: any, info: any) => {
      const { pass, email } = args;
      const usr = await User.findOne({ pass: pass, email: email }).exec();
      return usr;
    },

    //----------------------------------------------------------------------
    // DEVICES
    deviceids: async () => {
      var ids: any = [];
      await User.find({}, { "devices._id": 1, _id: 0 }).then((usrs: any) => {
        usrs.forEach((usr: any) => {
          ids.push(...usr.devices);
        });
      });
      return ids;
    },
  },

  Mutation: {
    //----------------------------------------------------------------------
    // USER
    createUser: async (parent: any, args: any, context: any, info: any) => {
      const { pass, email } = args;
      if (email === undefined || pass === undefined) return {};
      const usr = new User({ pass: pass, email: email });
      await usr.save();
      return usr;
    },

    //-----------------------------------------------------------------------
    // DEVICE
    createDevice: async (parent: any, args: any, context: any, info: any) => {
      const { user_id, uuid } = args;
      const user = await User.findById(user_id);
      if (user === null) return Error("user not found");
      const newdevice = new Device({ uuid: uuid });
      user?.devices.push(newdevice);
      const saved = await user?.save().then(() => {
        return "success";
      });
      return saved;
    },

    removeDevice: async (parent: any, args: any, context: any, info: any) => {
      const { user_id, device_id } = args;
      var response: any = "error";
      var user = await User.findById(user_id);
      if (user === null) throw new Error("user not found");
      await user.devices.forEach((element: any, id: number) => {
        if (element._id.toString() === device_id) {
          user.devices.splice(id, 1);
          user.save();
          response = "request completed";
          return;
        }
        throw new Error("device does not exist");
      });
      return response;
    },

    //-----------------------------------------------------------------------
    // STATE
    addData: async (parent: any, args: any, context: any, info: any) => {
      const { user_id, device_id, health, state, updated } = args;
      if (health === undefined && state === undefined)
        throw new Error("no health or state data");
      const usr = await User.findOne({
        _id: user_id,
      });

      var statusUpdate = {
        updated: updated,
        state: state,
        health: health,
      };

      var up: boolean = false;
      usr.devices.forEach(async (element: any, i: any) => {
        if (element._id.toString() === device_id) {
          usr.devices[i].state.push(statusUpdate);
          up = true;
        }
      });
      if (up === false) {
        return "device id not found";
      }

      usr.markModified("devices");
      usr.save();
      return JSON.stringify(usr);
    },

    addHealth: async (parent: any, args: any, context: any, info: any) => {
      const { device_id, health } = args;
      var statusUpdate = {
        updated: new Date().toString(),
        health: health,
      };
      await User.find({}, {}).then((result: any) => {
        result.forEach((usr: any, user_idx: any) => {
          usr.devices.forEach(async (element: any, device_idx: any) => {
            if (element._id.toString() === device_id) {
              result[user_idx].devices[device_idx].state.push(statusUpdate);
              result[user_idx].markModified(`devices`);
              return result[user_idx].save();
            }
          });
        });
      });
      return "success";
    },
  },
};
