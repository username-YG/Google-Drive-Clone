 const express = require('express')
const app = express()
const fileAndDirRoutes = require('./routes/fileAndDir')
const searchRoutes = require('./routes/search')
const usersRoutes = require('./routes/users')
const tokensRoutes = require('./routes/tokens')

app.use(express.json())
app.use('/api/files', fileAndDirRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/tokens', tokensRoutes)

app.listen(3000)