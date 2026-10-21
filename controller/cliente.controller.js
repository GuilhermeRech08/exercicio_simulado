const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'shh'

const cadastrar = async(req, res) => {
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.celular){
        return res.status(400).json({message: 'Preencha todos os campos!'})
    }

    if(valores.cpf.length !== 11){
        return res.status(400).json({message: 'O cpf precisa ter exatamente 11 digitos!'})
    }

    try{
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        const senhaCriptografada = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            celular: valores.celular
        })

        return res.status(201).json({message: 'Cliente cadastrado com sucesso!'})
    }catch(err){
        console.error('Erro ao cadastrar: ', err)
        res.status(500).json({message: 'Erro ao cadastrar!'})
    }
}

const listar = async(req, res) => {
    try{
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach((el) => {
            let cpfDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                cpfDescriptografado = 'Erro ao descriptografar'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                celular: el.celular
            })
        })

        return res.status(200).json(resultado)
    }catch(err){
        console.error('Erro ao listar clientes', err)
        return res.status(500).json({ message: 'Erro ao listar clientes!' })
    }
}

const consultar = async(req, res) =>{
    const id = req.params.id

    try{
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        console.log('bytes = ',bytes)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
        console.log('cpf descriptografado = ',cpfDescriptografado)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            celular: cliente.celular
        })
    }catch(err){
        console.error('Erro ao consultar cliente:', err)
        return res.status(500).json({ message: 'Erro ao consultar cliente!' })
    }
}

const apagar = async(req, res) => {
    const id = req.params.id
    try{    
        const cliente = await cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        await Cliente.destroy({where: {codCliente: id}})
        return res.status(200).json({message: 'Cliente apagado com sucesso!'})
    }catch(err){
        console.error('Erro ao apagar cliente:', err)
        return res.status(500).json({ message: 'Erro ao apagar cliente!' })
    }
}

const atualizar = async(req, res) => {
    const id = req.params.id
    const valores = req.body

    try{
        const cliente = await cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        const dadosAtualizados = {...valores}

        if(valores.cpf){
            if(valores.cpf.length !== 11){
                return res.status(400).json({message: 'O cpf precisa ter exatamente 11 digitos!'})
            }

            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if(valores.senha){
            dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Cliente.update(dadosAtualizados, {where: {codCliente: id}})
        return res.status(200).json({ message: 'Cliente atualizado com sucesso!' })
    }catch(err){
        console.error('Erro ao atualizar cliente:', err)
        return res.status(500).json({ message: 'Erro ao atualizar cliente!' })
    }
}

module.exports = {cadastrar, listar, consultar, apagar, atualizar}