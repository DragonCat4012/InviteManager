const { Sequelize, DataTypes } = require('sequelize');

const sql = new Sequelize('data', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'data.sqlite',
});


const Settings = sql.define('settings', {
    GID: {
        type: DataTypes.TEXT,
        unique: true,
    },
    PREFIX: {
        type: DataTypes.TEXT,
        defaultValue: '%'
    },
    WELCOMECHANNEL: {
        type: DataTypes.TEXT,
    },
})

const Member = sql.define('member', {
    MID: {
        type: DataTypes.TEXT,
        unique: true,
    },
    TOTAL: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    LEAVED: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    FAKE: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    BONUS: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    INVITER: {
        type: DataTypes.STRING
    }
});


const syncDatabase = async() => {
    try {
        await sql.sync();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

module.exports = { Member, Settings, syncDatabase }