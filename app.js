const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('common'))

const apps = require('./playstore.js')

app.get('/apps', (req, res) => {
  const { genres = " ", sort } = req.query
  console.log(req.query)
  if(sort) {
    if(!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card')
    }
  }
  let results = apps.filter(app => app.Genres.toLowerCase().includes(genres.toLowerCase()))

  if(sort) {
    results.sort((a,b) =>
      a[sort] > b[sort]
        ? -1
        : a[sort] < b[sort] 
          ? 1
          : 0
    )
  }

  res.json(results)
})

app.listen(8000, () => {
  console.log('Server started on PORT 8000')
})

module.exports = app