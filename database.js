const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Veritabanı bağlantısını oluştur
const sequelize = new Sequelize('losev', 'root', process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

// Modelleri tanımla
const userModel = require("./models/users")(sequelize, DataTypes);
const announcementModel = require("./models/announcement")(sequelize, DataTypes);
const categoryModel = require("./models/categories")(sequelize, DataTypes);
const productModel = require("./models/products")(sequelize, DataTypes);
const favoriteModel = require("./models/favorites")(sequelize, DataTypes);
const basketModel = require("./models/basket")(sequelize, DataTypes);

// İlişkileri kur
categoryModel.hasMany(productModel, { foreignKey: "categoryId", as: "products" });
productModel.belongsTo(categoryModel, { foreignKey: "categoryId", as: "category" });

favoriteModel.belongsTo(userModel, { foreignKey: "userId", as: "user"});
userModel.hasMany(favoriteModel, { foreignKey: "userId", as: "favs" });
favoriteModel.belongsTo(productModel, { foreignKey: "productId"});
productModel.hasMany(favoriteModel, { foreignKey: "productId" });

basketModel.belongsTo(userModel, { foreignKey: "userId" });
userModel.hasMany(basketModel, { foreignKey: "userId" });
basketModel.belongsTo(productModel, { foreignKey: "productId", as: "product" });
productModel.hasMany(basketModel, { foreignKey: "productId" });

// Bağlantıyı test et
sequelize.authenticate()
    .then(() => console.log('Veritabanına başarıyla bağlanıldı!'))
    .catch(err => console.error('Bağlantı hatası:', err));

const db = {
    sequelize,
    Sequelize,
    userModel,
    announcementModel,
    categoryModel,
    productModel,
    favoriteModel,
    basketModel,
}
// Tüm yapıyı export et
module.exports = db;