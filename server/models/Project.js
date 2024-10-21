const { model, Schema } = require('mongoose')

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },

    // description: {
    //   type: String,
    //   default: "",
    // },

    // status: {
    //   type: Boolean,
    //   default: false,
    // },

    dueDate: {
      type: String,
      required: true,
      default: "",
    },

    order: {
      type: String,
      required: true,
    },


    //members: [{ type: Schema.Types.ObjectId, ref: 'User' }],  this is going to be needed when we add members to the tasks
  },
  {
    timestamps: true,
  }
);

const columnSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  order: {
    type: String,
    required: true,
  },

  tasks: [taskSchema], // Nested tasks within a column
})

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User' //other users without admin privalges
  }],

  columns: [columnSchema], //Nested columns within a project
}, {
  timestamps: true
})

const Project = model('Project', projectSchema)

module.exports = Project