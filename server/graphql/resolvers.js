// NEEDS REVIEW, NOT DONE
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User")
const Project = require("../models/Project")
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/token')

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
// const JWT_EXPIRES_IN = '15m'; // Access Token expires in 15 minutes
// const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh Token expires in 7 days

// Generate Access Token


const resolvers = {
  Query: {
    // Auth resolver
    getUser: async (_, args, { req }) => {
      // Get access token from cookies
      const token = req.cookies.accessToken;
      if (!token) {
        throw new Error("Authentication required");
      }

      try {
        const payload = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) throw new Error("User not found");
        return user;
      } catch (err) {
        throw new Error("Invalid/Expired Token");
      }
    },

    // Get Project
    getAdminProject: async (_, { adminId }) => {
      if (!adminId) throw new Error('No admin provided.')

      const currentAdminProjects = await Project.find({ admin: adminId }).populate("admin")

      return currentAdminProjects
    },
  },

  Mutation: {
    createProject: async (_, { title, admin }) => {
      try {
        // Ensure the user is authenticated (assuming user object is passed in context)
        if (!admin) {
          throw new AuthenticationError('You must be logged in to create a project');
        }
        const projectAdmin = await User.findById(admin)
        if (!projectAdmin) {
          throw new Error('Admin user not found')
        }

        // Create the new project
        const newProject = new Project({
          title,
          admin: projectAdmin
          // members: [user._id], // Assuming the authenticated user is the admin/creator
          // columns: [], // Initial empty column list
        });

        // Save the project to the database
        await newProject.save();

        return newProject;
      } catch (err) {
        throw new Error('Failed to create project: ' + err.message);
      }
    },

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

    updateColumnOrder: async (_, { projectId, columnId, newOrder }) => {
      const project = await Project.findById(projectId);

      // Find the column to be moved
      const column = project.columns.id(columnId);
      if (!column) {
        throw new Error("Column not found");
      }

      // Remove the column from its current position
      project.columns = project.columns.filter((col) => col.id !== columnId);

      // Insert the column at the new order
      project.columns.splice(newOrder, 0, column);

      // Update the order property of columns based on the new order
      project.columns.forEach((col, index) => {
        col.order = index; // Update order based on index
      });

      await project.save();
      return project;
    },

    createTask: async (
      _,
      { projectId, columnId, title, description, order, user }
    ) => {
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
      project.columns.forEach((column) => {
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

    register: async (_, { username, email, password }, { res }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set tokens in HttpOnly cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return {
        user,
      };
    },

    login: async (_, { username, password }, { res }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set tokens in HttpOnly cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return {
        user,
      };
    },

    refreshAccessToken: async (_, __, { req, res }) => {
      const refreshToken = req.cookies.refreshToken; // Get from cookies
      if (!refreshToken) throw new Error("No refresh token provided");

      try {
        const payload = verifyToken(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(payload.userId);
        if (!user) throw new Error("User not found");

        const newAccessToken = generateAccessToken({ id: user._id });
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
        return { accessToken: newAccessToken };
      } catch (error) {
        throw new Error("Invalid refresh token");
      }
    },

    logout: async (_, __, { res }) => {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      return true;
    },
  },

  // logout: (parent, args, context) => {
  //   console.log('back end logout')

  //   context.res.clearCookie('refreshToken', {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'Strict',
  //   });
  //   return true;
  // },
};


module.exports = resolvers