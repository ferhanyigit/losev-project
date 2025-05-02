module.exports = (sequelize, DataTypes) => {
    return sequelize.define('anouncement', {
        title: {
            type: DataTypes.STRING,
        },
        photoLink: {
            type: DataTypes.STRING,
        },
        photoType: {
            type: DataTypes.STRING,
        },
        photoSize: {
            type: DataTypes.DOUBLE,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'anouncement',
        timestamps: false
    });
};