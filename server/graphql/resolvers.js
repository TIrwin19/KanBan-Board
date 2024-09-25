// NEEDS REVIEW, NOT DONE

const User = require("../models/User")
const Task = require("../models/task")
const Column = require("../models/column")

// Need a function for creating a user token
// function createToken(user) {

// }

const resolvers = {
  Query: {
    // Auth resolver
    async authenticate(_, args, context) {
      const id = context.req?.user.id;
      if (!id) return null;

      // Use the User model to grab the user by req.user_id
      const user = await User.findById(id);
      return user;
    },

    columns: async () => await Column.find().populate('tasks'),

    column: async (_, { id }) => await Column.findById(id).populate('tasks'),

    tasks: async (_, { columnId }) => await Task.find({ column: columnId }),

  },

  // Mutation: {

  // },
}