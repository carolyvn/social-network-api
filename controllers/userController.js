const User = require('../models/User');

module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find()
          .then((users) => res.json(users))
          .catch((err) => res.status(500).json(err));
    },
    // Get a single user by its _id 
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.ObjectId })
          .populate({ path: 'thoughts', select: '-__v' })
          .populate({ path: 'friends', select: '-__v' })
          .then((user) => 
            !user
              ? res.status(404).json({ message: 'No user with that ID'})
              : res.josn(user)
          )
          .catch((err) => res.status(500).json(err));
    },
    // Create a new user
    createUser(req, res) {
        User.create(req.body)
          .then((dbUserData) => res.json(dbUserData))
          .catch((err) => res.status(500).json(err));
    },
    // Update a user by its _id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            {$set: req.body}, 
            { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with that id'})
              : res.json(user) 
          )
          .catch((err) => {
              res.status(500).json(err);
          });
    },
    // Delete a user by its _id and associated thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with that id'})
              : Thought.deleteMany({ _id: { $in: user.thoughts } })
          )
          .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
          .catch((err) => res.status(500).json(err));
    }
};