const express = require('express')
const app = express()
const filesRoutes = require('./routes/files')
const searchRoutes = require('./routes/search')
const usersRoutes = require('./routes/users')
const tokensRoutes = require('./routes/tokens')

app.use(express.json())
app.use('/api/files', filesRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/tokens', tokensRoutes)

app.listen(3000)