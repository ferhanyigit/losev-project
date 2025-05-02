module.exports = (sequelize, DataTypes) => {
    return sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        photoLink: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.DOUBLE
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "category", // tablo adı
                key: "id"
            }
        }
    }, {
        tableName: 'products',
        timestamps: false
    });
};