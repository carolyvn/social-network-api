const { connect, connection, connections } = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost/socail-network-api'

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;