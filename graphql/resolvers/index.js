const {AuthenticationError} = require('apollo-server');

const user = require('./user');
const board = require('./board');
const project = require('./project');
const boardColumn = require('./boardColumn');
const boardTask = require('./boardTask');


module.exports = {
  Query: {
    hello: () => {
      return {message: 'Hello from Kanbanana GraphQL API!'}
    },
    user: (_, __, {isAuth, userId}) => {
      if (!isAuth) {
        return null
      }
      return user.getUser(userId)
    },
    projects: (_, __, {isAuth, userId}) => {
      authGuard(isAuth);
      return project.getProjects(userId)
    },
    board: async (_, args, {isAuth}) => {
      authGuard(isAuth);
      return board.getBoard(args)
    },
    boards: async (_, args, {isAuth, userId}) => {
      authGuard(isAuth);
      return board.getBoards(args, userId)
    }
  },
  Mutation: {
    createUser: (_, args) => {
      return user.createUser(args)
    },
    login: (_, args) => {
      return user.login(args)
    },
    createProject: (_, args, {isAuth, userId}) => {
      authGuard(isAuth);
      return project.createProject(args, userId)
    },
    updateProject: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return project.updateProject(args)
    },
    createBoard: (_, args, {isAuth, userId}) => {
      authGuard(isAuth);
      return board.createBoard(args, userId)
    },
    updateBoard: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return board.updateBoard(args)
    },
    dragColumnInBoard: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return board.dragColumnInBoard(args)
    },
    createBoardColumn: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return boardColumn.createBoardColumn(args)
    },
    updateBoardColumn: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return boardColumn.updateBoardColumn(args)
    },
    deleteBoardColumn: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return boardColumn.deleteBoardColumn(args)
    },
    dragTaskInColumn: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return boardColumn.dragTaskInColumn(args)
    },
    createBoardTask: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return boardTask.createBoardTask(args)
    },
    updateBoardTask: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return boardTask.updateBoardTask(args)
    },
    deleteBoardTask: (_, args, {isAuth}) => {
      authGuard(isAuth);
      return boardTask.deleteBoardTask(args)
    }
  }
};

function authGuard(isAuth) {
  if (!isAuth) {
    throw new AuthenticationError('You must be logged in.');
  }
}
