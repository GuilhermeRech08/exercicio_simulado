const CryptoJS = require('crypto-js')
const Drone = require('../models/Drone')
const Cliente = require('../models/Cliente')

const cadastrar = async(req, res) => {
    const valores = req.body

    if(!valores.modelo || !valores.marca || !valores.numero || !valores.tipo_servico || !valores.idCliente){
        return res.status(400).json({ message: 'preencha todos os campos' })
    }

    try{
        const numeroCriptografado = CryptoJS.AES.encrypt(valores.numero, CHAVE_SECRETA).toString()

        const cliente = await Cliente.findByPk(valores.idCliente)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        const novoDrone = await Drone.create({
            modelo: valores.modelo,
            marca: valores.marca,
            numero: numeroCriptografado,
            tipo_servico: valores.tipo_servico,
            idCliente: valores.idCliente
        })
        return res.status(201).json({ message: 'Drone cadastrado com sucesso!', drone: novoDrone})
    }catch(err){
        console.error('Erro ao cadastrar drone:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar drone!' })
    }
}

const listar = async (req, res) => {
    try {
        const drones = await Drone.findAll()
        let resultado = []

        drones.forEach((el)=>{
            let numeroDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.numero, CHAVE_SECRETA)
                numeroDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                numeroDescriptografado = 'Erro ao descriptografar'
                console.error(numeroDescriptografado, err)
            }
            resultado.push({
                codCliente: el.codCliente,
                idCliente: el.idCliente,
                mmodelo: el.modelo,
                marca: el.marca,
                numero: numeroDescriptografado,
                tipo_servico: el.tipo_servico
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao listar drones:', err)
        return res.status(500).json({ message: 'Erro ao listar drones!' })
    }
}

module.exports = {cadastrar, listar}