const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Drone = db.define('drone', {
    codDrone: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codCliente',
            model: 'clientes'
        }
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo_servico: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
},{
    tableName: 'drones',
    timestamps: false
})

module.exports = Drone