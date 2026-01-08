const express = require('express')
const app = express()
const filesRoutes = require('./routes/files')
const searchRoutes = require('./routes/search')
const usersRoutes = require('./routes/users')
const tokensRoutes = require('./routes/tokens')
const cors = require('cors');

app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/files', filesRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/tokens', tokensRoutes)

const webPort = +process.argv[4];
app.listen(webPort);