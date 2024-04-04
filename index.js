require('dotenv').config()
const express = require('express')
const { client } = require('./client.js')
const app = express()


app.use(require('cors')()) 
app.use(express.json()) 
app.use(require('morgan')('dev')) // logger

app.use('/api', require('./api/index.js'))


app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500).send({ error: err.message ? err.message : err })
})

const init = async () => {
  const port = process.env.PORT || 3000
  await client.connect()

  app.listen(port, () => console.log(`\nlistening on port ${port}`))
}

init()

