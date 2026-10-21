const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Cliente = db.define('cliente', {
    codCliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    celular: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'clientes',
    timestamps: false
})

module.exports = Cliente