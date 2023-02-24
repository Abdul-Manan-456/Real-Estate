const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const routes = require('./src/routes')
const cors = require('cors');
const helmet = require('helmet')
const dotenv = require('dotenv').config({ path: path.join(__dirname, 'config', '.env') })
const { connectDB } = require('./config/db')
const { handleSocket } = require('./src/utils/socketHandler')



//MORGAN
app.use(morgan('tiny'));

//JSON DATA PARSING
app.use(express.json())

// HANDLING application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// HELMET 
app.use(helmet());

//CORS
app.use(cors());


//ROUTES
app.use('/api/v1', routes)

//STATIC FILES
app.use('/public', express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

//  VIEW ENGINE
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs')

// SERVER 
const server = require('http').createServer(app);
const port = 3000
const { Server } = require('socket.io');

// SOCKET IO
const io = new Server(server)
handleSocket(io)

connectDB().then(() => {
    server.listen(port, () => {
        console.log(`listening on ${port}`)
    });
})

//ERROR MIDDLEWARE
const { notFound, errorHandler } = require('./src/middleWares/errorMiddleware');
app.use(notFound);
app.use(errorHandler)