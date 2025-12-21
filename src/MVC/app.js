const express = require('express')
const app = express()
const fileAndDirRoutes = require('./routes/fileAndDir')
const searchRoutes = require('./routes/search')
const usersRoutes = require('./routes/users')
const tokensRoutes = require('./routes/tokens')

app.use(express.json())
app.use('http://foo.com/api/files', fileAndDirRoutes)
app.use('http://foo.com/api/search', searchRoutes)
app.use('http://foo.com/api/users', usersRoutes)
app.use('http://foo.com/api/tokens', tokensRoutes)

app.listen(3000)