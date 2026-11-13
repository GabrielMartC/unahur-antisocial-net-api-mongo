require('dotenv').config()

const swaggerUi =require('swagger-ui-express')
const spec = require('../swagger/swagger')
const express = require('express')
const connectDB = require('./config/db');
const rutas = require('./routes')
const app = express()

app.use(express.json())
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(spec))
app.use('/users', rutas.userRutas)
app.use('/post', rutas.postRutas)
app.use('/comment', rutas.commentRutas)
app.use('/tag', rutas.tagRutas)

const PORT = process.env.PORT || 3000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
