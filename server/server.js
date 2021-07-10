const path = require('path')
const express = require('express')


publicPth = path.join(__dirname, '../public')
// console.log(__dirname + '/../public')
// console.log(publicPth)
const port = process.env.PORT || 3000


var app = express()
app.use(express.static(publicPth))

app.listen(port,()=>{
    console.log(`started app on port ${port}`)

})