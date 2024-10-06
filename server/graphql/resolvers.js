// NEEDS REVIEW, NOT DONE
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User")
const Project = require("../models/Project")

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
// const JWT_EXPIRES_IN = '15m'; // Access Token expires in 15 minutes
// const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh Token expires in 7 days

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};


const resolvers = {
  Query: {
    // Auth resolver
    getUser: async (_, args, { req }) => {
      // Extract token from headers
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error("Authentication token is missing");
      }
      const token = authHeader.split(" ")[1];
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        return user;
      } catch (error) {
        throw new Error("Invalid/Expired token");
      }

      //======================================
      // const token = context.req.headers.authorization?.split(" ")[1];  // Get token from Authorization header
      // console.log('token:', token)
      // console.log('context:', context.req.headers)

      // if (!token) {
      //   throw new Error('Not authenticated');
      // }

      // try {
      //   const decoded = verify(token, JWT_SECRET);
      //   const user = await User.findById(decoded.id);
      //   if (!user) throw new Error('User not found');
      //   return { id: user._id, username: user.username, email: user.email };
      // } catch (error) {
      //   throw new Error('Invalid or expired token');
      // }
    },

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

    updateColumnOrder: async (_, { projectId, columnId, newOrder }) => {
      const project = await Project.findById(projectId);

      // Find the column to be moved
      const column = project.columns.id(columnId);
      if (!column) {
        throw new Error('Column not found');
      }

      // Remove the column from its current position
      project.columns = project.columns.filter(col => col.id !== columnId);

      // Insert the column at the new order
      project.columns.splice(newOrder, 0, column);

      // Update the order property of columns based on the new order
      project.columns.forEach((col, index) => {
        col.order = index; // Update order based on index
      });

      await project.save();
      return project;
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

    register: async (_, { username, email, password }) => {


      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      // Generate Tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return {
        accessToken,
        refreshToken,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        }
      }

      // console.log('Reg Password entered:', password);

      // const existingUser = await User.findOne({ username });
      // if (existingUser) {
      //   throw new Error('Username already taken');
      // }

      // const hashedPassword = await bcrypt.hash(password, 12);
      // const newUser = new User({ username, email, password: hashedPassword });

      // await newUser.save();

      // const accessToken = sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      // const refreshToken = sign({ id: newUser._id }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

      // context.res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   // secure: true,
      //   secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production 
      //   sameSite: 'Strict'
      // });

      // return {
      //   accessToken,
      //   user: {
      //     id: newUser._id,
      //     username: newUser.username,
      //     email: newUser.email,
      //   },
      // };
    },

    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      // Generate Tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);


      // console.log('Login Password entered:', password);
      // const user = await User.findOne({ username });
      // // console.log('Login Hashed password from DB:', user.password);
      // if (!user) {
      //   console.log('No user found for username:', username); // Debugging log
      //   throw new Error('Invalid credentials');
      // }

      // const isMatch = await bcrypt.compare(password, user.password);


      // if (!isMatch) {
      //   console.log('Password mismatch for user:', username);  // Add debug log
      //   throw new Error('Invalid credentials');
      // }

      // const accessToken = sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      // const refreshToken = sign({ id: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

      // // console.log('refresh token', refreshToken)
      // context.res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   // secure: true,
      //   secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production 
      //   sameSite: 'Strict'
      // });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      };
    },

    refreshAccessToken: async (_, { refreshToken }) => {

      try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) {
          throw new Error('User not found');
        }
        const newAccessToken = generateAccessToken(user);
        return {
          accessToken: newAccessToken,
        };
      } catch (error) {
        throw new Error('Invalid refresh token');
      }

      // console.log('refresh triggered')
      // console.log('context:', context.req.cookies)
      // const { refreshToken } = context.req.cookies;
      // console.log('refreshToken:', refreshToken)

      // if (!refreshToken) {
      //   throw new Error('Not authenticated');
      // }

      // try {
      //   // Verify the refresh token
      //   const decoded = verify(refreshToken, REFRESH_SECRET);
      //   // Generate a new access token
      //   const accessToken = sign({ id: decoded.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      //   return {
      //     accessToken,
      //     user: { id: decoded.id }
      //   };

      // } catch (error) {
      //   throw new Error('Invalid or expired refresh token');
      // }
    },

    logout: (parent, args, context) => {
      console.log('back end logout')

      context.res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
      return true;
    },
  },
}

module.exports = resolvers