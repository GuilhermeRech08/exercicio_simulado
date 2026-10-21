const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Agendamento = db.define('agendamento', {
    codAgendamento: {
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
    idDrone: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codDrone',
            model: 'drones'
        }
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    }
},{
    tableName: 'agendamentos',
    timestamps: false
})

module.exports = Agendamento