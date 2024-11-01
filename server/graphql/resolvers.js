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

    // Get Project Title
    getProject: async (_, { projectId }) => {
      if (!projectId) throw new Error("No project ID provided")
      const project = await Project.findById(projectId)
        .populate("admin")

      if (!project) throw new Error("No project by that ID exists")

      return project
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

    deleteProject: async (_, { projectId, adminId }) => {
      if (!projectId || !adminId) throw new Error("Project ID and or Admin ID not provided")

      const project = await Project.findById(projectId)
      if (!project) throw new Error("Project does not exist")

      const admin = project.admin.toString()
      if (admin !== adminId) throw new Error("You are not the admin of this Project")

      await project.deleteOne()
      return true
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
    },

    // createColumn: async (_, { projectId, title, order }) => {
    //   const project = await Project.findById(projectId);
    //   const column = { title, order, tasks: [] };
    //   project.columns.push(column);
    //   await project.save();
    //   return column;
    // },

    // deleteColumn: async (_, { projectId, columnId }) => {
    //   const project = await Project.findById(projectId);
    //   project.columns.id(columnId).remove();
    //   await project.save();
    //   return true;
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

    updateProjectColumns: async (_, { projectId, columns }) => {
      try {
        // Locate project
        const project = await Project.findById(projectId);
        if (!project) throw new Error("Project not found");

        // console.log("project before update:", project)

        // Iterate through each updated column to move tasks as needed
        columns.forEach(updatedColumn => {
          const targetColumn = project.columns.find(c => c.order === updatedColumn.order);
          // console.log("target column:", targetColumn)

          if (targetColumn && updatedColumn.tasks) {
            // console.log("updated column:", updatedColumn.tasks)

            updatedColumn.tasks.forEach(updatedTask => {
              // Locate the task in its original column
              // console.log("updated task:", updatedTask)
              const originalColumn = project.columns.find(col =>
                col.tasks.some(t => t.order.toString() === updatedTask.order)
              );
              // console.log("original column:", originalColumn)

              if (originalColumn) {

                const taskIndex = originalColumn.tasks.findIndex(t => t.order.toString() === updatedTask.order);
                if (taskIndex !== -1) {
                  // console.log("task index:", taskIndex)

                  // Move the task to the new column if it's different from the original
                  const [task] = originalColumn.tasks.splice(taskIndex, 1);
                  targetColumn.tasks.push(task);
                }
              }
            });
          } else {
            console.error(`Column with order ${updatedColumn.order} not found in project.`);
          }
        });
        // console.log("project before save:", project)
        await project.save();
        return `Project ${project.title} has been updated`;
      } catch (err) {
        console.error("Error updating project columns:", err.message);
        throw new Error("Failed to update project columns: " + err.message);
      }
    },

    deleteTask: async (_, { projectId, columOrder, taskOrder }) => {
      if (!projectId || !columOrder || !taskOrder) throw new Error("Prpper credentials not provided")
      const project = await Project.findById(projectId);
      console.log("project:", project)
      if (!project) throw new Error("Project does not exist")
      const column = project.columns.order(columnOrder);
      console.log("column:", column)
      if (!column) throw new Error("Column does not exist")
      const task = column.tasks.order(taskOrder)
      console.log("task:", task)
      if (!task) throw new Error("Task does not exist")
      await task.deleteOne()
      return true;
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
