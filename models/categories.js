module.exports = (sequelize, DataTypes) => {
    return sequelize.define('category', {
        title: {
            type: DataTypes.STRING
        },
        photoLink: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'category',
        timestamps: false
    });
};