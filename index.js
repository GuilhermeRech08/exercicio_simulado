const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')
const authController = require('./controller/auth.controller')
const clienteController = require('./controller/cliente.controller')
const droneController = require('./controller/drone.controller')
const agendamentoController = require('./controller/agendamento.controller')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

//rotas publicas
app.post('/cliente', clienteController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req, res) => {
    res.status(200).json({message: 'Aplicação rodando!'})
})

app.use(authMiddleware)

app.get('/clientes', clienteController.listar)
app.get('/cliente/:id', clienteController.consultar)
app.delete('/cliente/:id', clienteController.apagar)
app.put('/cliente/:id', clienteController.atualizar)

app.post('drone', droneController.cadastrar)
app.get('/drones', droneController.listar)
app.post('/agendamento', agendamentoController.cadastrar)
app.put('/agendamento/:id', agendamentoController.atualizar)
app.get('/agendamentos', agendamentoController.listarAgenda)

conn.sync()
.then(() => {
    app.listen(PORT, hostname, () => {
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err) => {
    console.error('Erro ao conectar com o banco de dados!', err)
})