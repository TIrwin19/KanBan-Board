// NEEDS REVIEW, NOT DONE
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/token");

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
// const JWT_EXPIRES_IN = '15m'; // Access Token expires in 15 minutes
// const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh Token expires in 7 days

// Generate Access Token

function validateEmail(value) {
  const exp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)

  return exp.test(value)
}

const resolvers = {
  Query: {
    //get tasks
    getTasks: async (_, { projectId }) => {
      const project = await Project.findById(projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      return project.columns
    },


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

    // Get Admin Projects
    getAdminProject: async (_, { adminId }) => {
      if (!adminId) throw new Error("No admin provided.");

      const currentAdminProjects = await Project.find({
        admin: adminId,
      }).populate("admin");

      return currentAdminProjects;
    },

    //Get Joined Projects
    getJoinedProject: async (_, { userId }) => {
      if (!userId) throw new Error("No userId provided.")

      const joinedProjects = await Project.find({
        members: userId,
      }).populate("members")

      return joinedProjects
    },

    //Get User Avatar
    getUserAvatar: async (_, { userId }) => {

      if (!userId) throw new Error("No user provided.");
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found."); // Check if user exists
      const avatar = user.avatar || `https://avatar.iran.liara.run/username?username=${user.username}+`;
      // console.log("User found:", user); // Log user data
      // console.log("User Avatar from DB:", avatar);
      return avatar
    },
  },

  Mutation: {
    createProject: async (_, { title, admin }) => {
      try {
        // Ensure the user is authenticated (assuming user object is passed in context)
        if (!admin) {
          throw new AuthenticationError(
            "You must be logged in to create a project"
          );
        }
        const projectAdmin = await User.findById(admin);
        if (!projectAdmin) {
          throw new Error("Admin user not found");
        }

        // Define the default columns (e.g., "To Do", "In Progress", "Done")
        const defaultColumns = [
          {
            title: 'To Do',
            order: 'column1',
            tasks: [],
          },
          {
            title: 'In Progress',
            order: 'column2',
            tasks: [],
          },
          {
            title: 'Done',
            order: 'column3',
            tasks: [],
          },
        ];

        // Create the new project
        const newProject = new Project({
          title,
          admin: projectAdmin,
          // members: [user._id], // Assuming the authenticated user is the admin/creator
          columns: defaultColumns, // Initial empty column list
        });

        // Save the project to the database
        await newProject.save();

        return newProject;
      } catch (err) {
        throw new Error("Failed to create project: " + err.message);
      }
    },

    addMembers: async (_, { projectId, adminId, userEmail }) => {
      //If no admin id is present don't procede
      if (!adminId) throw new Error("Admin ID not provided.")

      //Find Project by ID
      const project = await Project.findById(projectId)
      if (!project) throw new Error("Project does not exist.")

      //Validate Email
      const email = validateEmail(userEmail)
      if (!email) throw new Error("Invalid email entered.")

      //Find user by email
      const member = await User.findOne({ email: userEmail })
      if (!member) {
        return {
          message: "No one by that email exists.",
          color: "red"
        }
      } else if (project.members.includes(member._id)) {
        //Check if user is already a member
        return {
          message: "User is already a member of the project.",
          color: "yellow"
        }
      } else {
        //Add the member to the project
        project.members.push(member._id)
        await project.save()//Save the updated project

        return {
          message: `${member.username} has been added to ${project.title}`,
          color: "green"
        }
      }




      //Add the member to the project
      project.members.push(member._id)
      await project.save()//Save the updated project

      return `${member.username} has been added to ${project.title}`
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

    // updateColumnOrder: async (_, { projectId, columnId, newOrder }) => {
    //   const project = await Project.findById(projectId);

    //   // Find the column to be moved
    //   const column = project.columns.id(columnId);
    //   if (!column) {
    //     throw new Error("Column not found");
    //   }

    //   // Remove the column from its current position
    //   project.columns = project.columns.filter((col) => col.id !== columnId);

    //   // Insert the column at the new order
    //   project.columns.splice(newOrder, 0, column);

    //   // Update the order property of columns based on the new order
    //   project.columns.forEach((col, index) => {
    //     col.order = index; // Update order based on index
    //   });

    //   await project.save();
    //   return project;
    // },

    createTask: async (_, { projectId, columnId, title, order, dueDate }) => {
      try {
        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
          throw new Error("Project not found");
        }

        // Find the column where the order property matches columnId
        const column = project.columns.find(col => col.order === columnId);
        if (!column) {
          throw new Error("Column with the specified order not found");
        }

        // Ensure task has necessary details
        if (!title || !order || !dueDate) {
          throw new Error("Title, order, and due date are required");
        }

        // Create the task object
        const task = { title, order, dueDate };

        // Add the task to the column's task list
        column.tasks.push(task);

        // Save the project with the new task
        await project.save();

        return "Task has been created";
      } catch (err) {
        // Handle and log the error
        console.error("Error creating task:", err.message);
        throw new Error("Failed to create task: " + err.message);
      }
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

    setAvatar: async (_, { userId, avatar }) => {
      // console.log("setAvatar mutation runs in backend");
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      user.avatar = avatar// Update the avatar
      await user.save(); // Save the user

      return true; // Return the updated user
    },
  },
};

module.exports = resolvers;
