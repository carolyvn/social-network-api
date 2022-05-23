const { connect, connection } = require('mongoose');

connect('mongodb://localhost/usersThoughts', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;