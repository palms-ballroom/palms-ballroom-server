if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')
const router = require('./routes')
const errHandler = require('./middleware/errhandler')

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/', router)
app.use(errHandler)

app.listen(PORT, function(){
  console.log(`online ${PORT}`)
})