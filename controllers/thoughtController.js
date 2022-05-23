const { User, Thought, Reaction } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
          .then((thoughts) => res.json(thoughts))
          .catch((err) => res.status(500).json(err));
    },
    // Get a single thought by its _id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId})
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that id'})
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },
    // Create a new thought and update user's thought
    createThought(req, res) {
        Thought.create(req.body)
          .then((thought) => {
              return User.findOneAndUpdate(
                  { _id: req.body.userId },
                  { $addToSet: { thoughts: thought._id }},
                  { new: true }
              );
          })
          .then((user) => 
            !user
              ? res.status(404).json({ message: 'Thought created, but found no user with that id '})
              : res.json('Thought created!')
          )
          .catch((err) => res.status(500).json(err));
    },
    // Update a thought by its _id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with this id'})
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },
    // Delete a thought by its _id
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
          .then((thought) => 
            !thought
              ? res.status(404).json({ message: 'No thought with this id' })
              : User.findOneAndUpdate(
                  { thoughts: req.params.thoughtId },
                  { $pull: { thoughts: req.params.thoughtId }},
                  { new: true }
              )
          )
          .then((user) => 
            !user
              ? res.status(404).json({ message: 'No thought with that id' })
              : res.json({ message: 'Thought successfully deleted! '})
          )
          .catch((err) => res.status(500).json(err));
    },
    // Add a reaction to associated thought
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
        )
          .then((thought) => 
            !thought
              ? res.status(404).json({ message: 'No thought with that id' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },
    // Delete a reaction in associated thought
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { thoughtId: req.params.thoughtId }}},
            { runValidators: true, new: true }
        )
          .then((thought) => 
            !thought
              ? res.status(404).json({ message: 'No thought with this id' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },
};