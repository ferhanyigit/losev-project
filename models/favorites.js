module.exports = (sequelize, DataTypes) => {
    return sequelize.define('favorites', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users", // tablo adı
                key: "id"
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "products", // tablo adı
                key: "id"
            } 
        }
    }, {
        tableName: 'favorites',
        timestamps: false
    });
};