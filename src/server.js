import express from 'express';
import morgan from 'morgan';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
// import usersRouter from './routes/users.router.js';
import Path from './path.js';//antes "import { __dirname } from './path.js';"
import bodyParser from 'body-parser';   
import { errorhandler } from './middlewares/errorHandler.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';

const app = express();
const path = Path

// middleware globales
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(errorhandler);
app.use(express.static(path + '/public/images'));
app.use(bodyParser.urlencoded({ extended: true }));//agregue
app.use(bodyParser.json());//agregue
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path + '/views'); //! segun clase "app.set('views', __dirname + '/views');"
//esto debieramos hacerlo con router
app.get('/', (req, res) => {
    res.render('websockets')
});
//middleware local
app.use('/api/products', productsRouter);
// app.use('/api/users', usersRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8081;
const httpServer = app.listen(PORT, ()=>{
    console.log(`server ok en puerto ${PORT}`);
});

const socketServer = new Server(httpServer);
//avisamos al servidor que se conecto un nuevo cliente
//socketServer va a escuchar un evento de tipo connection
//denetro de parametro hacemos que llegue el socket de cliente
socketServer.on('connection', (socket) => {
    console.log('usuario conectado', socket.id);
});