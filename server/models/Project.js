//NEEDS REVIEW

const { model, Schema } = require('mongoose')

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: ""
  },

  description: {
    type: String,
    required: true,
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

}, {
  timestamp: true
})

const columnSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  order: {
    type: Number,
    required: true,
  },

  tasks: [taskSchema], // Nested tasks within a column
})

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  // admin?

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User' //other users without admin privalges
  }],

  columns: [columnSchema], //Nested columns within a project
})

const Project = model('Project', projectSchema)

module.exports = Project