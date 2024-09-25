const { sequelize } = require('../config');
const User = require('./User');
const UserTask = require('./UserTask');
const Project = require('./Project');
const Task = require('./Task');
const path = require('path');
const TaskStatus = require(path.resolve(__dirname, 'TaskStatus'));
const UserProject = require('./UserProject');
const Role = require('./Role');


User.belongsToMany(Project, { through: UserProject, foreignKey: 'user_id' });
Project.belongsToMany(User, { through: UserProject, foreignKey: 'project_id' });

Project.hasMany(Task, { foreignKey: 'project_id' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

Task.belongsTo(TaskStatus, { foreignKey: 'task_status_id' });
TaskStatus.hasMany(Task, { foreignKey: 'task_status_id' });

Task.belongsToMany(User, { through: UserTask, foreignKey: 'task_id' });
User.belongsToMany(Task, { through: UserTask, foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    Project,
    Task,
    Role,
    TaskStatus,
    UserProject,
};