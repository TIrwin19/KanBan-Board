//NEEDS REVIEW, NOT DONE

const { model, Schema } = require('mongoose')

const columnSchema = new Schema({
  title: {
    type: String,
    require: true,
  },

  order: {
    type: Number,
    require: true,
  },

  tasks: [taskSchema],
})

const taskSchema = new Schema({
  title: {
    type: String,
    require: true,
    default: ""
  },

  description: {
    type: String,
    reqiuire: true,
    default: ""
  },

  status: {
    type: Boolean,
    required: true,
    default: false
  },

  date: {
    type: String,
    required: true,
    default: ""
  },

  order: {
    type: Number,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  column: columnSchema,
}, {
  timestamp: true
})

const projectSchema = new Schema({
  title: {
    type: String,
    require: true,
  },

  // admin?

  members: {
    type: Schema.Types.ObjectId,
    ref: ['User'] //other users without admin privalges
  },

  columns: [columnSchema],
  tasks: [taskSchema],
})

const Project = model('Project', projectSchema)

module.exports = Project