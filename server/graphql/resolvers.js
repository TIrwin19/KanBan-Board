// NEEDS REVIEW, NOT DONE

const { User, Project } = require("../models")

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

    // columns: async () => await Column.find().populate('tasks'),

    // column: async (_, { id }) => await Column.findById(id).populate('tasks'),

    // tasks: async (_, { columnId }) => await Task.find({ column: columnId }),

    // Get Project
    getProject: async (_, { id }) => {
      return await Project.findById(id)
    },

  },

  Mutation: {
    createColumn: async (_, { projectId, title, order }) => {
      const project = await Project.findById(projectId);
      const column = { title, order, tasks: [] };
      project.columns.push(column);
      await project.save();
      return column;
    },
    deleteColumn: async (_, { projectId, columnId }) => {
      const project = await Project.findById(projectId);
      project.columns.id(columnId).remove();
      await project.save();
      return true;
    },
    createTask: async (_, { projectId, columnId, title, description, order, user }) => {
      const project = await Project.findById(projectId);
      const column = project.columns.id(columnId);
      const task = { title, description, order, user };
      column.tasks.push(task);
      await project.save();
      return task;
    },
    deleteTask: async (_, { projectId, columnId, taskId }) => {
      const project = await Project.findById(projectId);
      const column = project.columns.id(columnId);
      column.tasks.id(taskId).remove();
      await project.save();
      return true;
    },
    moveTask: async (_, { projectId, taskId, newColumnId, order }) => {
      const project = await Project.findById(projectId);
      let task;

      // Find and remove the task from its current column
      project.columns.forEach(column => {
        const foundTask = column.tasks.id(taskId);
        if (foundTask) {
          task = foundTask;
          column.tasks.id(taskId).remove();
        }
      });

      // Add the task to the new column
      const newColumn = project.columns.id(newColumnId);
      newColumn.tasks.push({ ...task.toObject(), order });

      await project.save();
      return project;
    },
  },
}

module.exports = resolvers