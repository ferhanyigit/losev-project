const express = require('express');
const { sequelize } = require('./database'); // Sequelize bağlantısını içe aktar
const { userModel, announcementModel, categoryModel, 
    productModel, favoriteModel, basketModel } = require("./database");

const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");
require('dotenv').config();

const port = process.env.PORT;

sequelize.sync({ force: false }) // force: true yaparsan tabloyu sıfırlar!
    .then(() => console.log("Veritabanı senkronize edildi."))
    .catch(err => console.log("Senkronizasyon hatası:", err));

app.post("/sign-in", async (req,res)=>{
    const { phone, password } = req.body;

    const kullanici = await userModel.findOne({ where: { phone }});

    if(kullanici == null) {
        res.status(500).json({ status: "error", data: "Telefon yanlış"})
        
    } else {
        console.log("ŞIFRELER", password, kullanici.password)
        const ayniSifre = await bcrypt.compareSync(password, kullanici.password)
        console.log("aynı mı?", ayniSifre)

        if(!ayniSifre) {
            res.status(500).json({ status: "error", data: "Şifre yanlış"})
        } else {
            res.status(200).json({ status: "success", data: kullanici })
        }
    }
});

app.get("/all-users", async (req, res) => {
    try {
    const allUsers = await userModel.findAll();

    res.status(200).json({ status: "success", data: allUsers });
    } catch (error) {
        res.status(500).json({ status: "error", data: error })
    }
});
app.get("/user/:id", async (req, res) => {
    const { id } = req.params;

    try {
    const newUser = await userModel.findOne({ where: { id: id }});

    res.status(200).json({ status: "success", data: newUser })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).json({ status: "error", data: error })
    }

});
app.post("/sign-up",
    [
        body("email").isEmail().withMessage("Geçersiz e-posta!"),
        body("phone").isMobilePhone("tr-TR").withMessage("Geçersiz telefon numarası!"),
        body("password").isLength({ min: 8 }).withMessage("Şifre en az 8 karakter olmalı!")
        .matches(/[A-Z]/).withMessage("Şifrede en az bir büyük harf olmalı!")
        .matches(/[a-z]/).withMessage("Şifrede en az bir küçük harf olmalı!")
        .matches(/\d/).withMessage("Şifrede en az bir sayı olmalı!")
    ],
     async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        } else {
            try {
                const { id, firstName, lastName, email, phone, password } = req.body;
            

                const userExists = await userModel.findOne({ where: { phone: phone } })
                if(userExists) {
                    res.status(500).json({ status: "error", data: "Kullanıcı mevcut"})
                } else {

                const sansurluSifre = await bcrypt.hash(password, 10);
                const newUser = userModel.create({ id, isim: firstName, soyisim: lastName, email, phone, password: sansurluSifre, birthDate: "1999-07-06", gender: "female" })

                res.status(200).json({ status: "success", data: "Kullanıcı eklendi" })
                }
            } catch (error) {
                res.status(500).json({ status: "error", data: error })
            }
        }
    });

    app.post("/new-announcement", async (req,res) => {
        const{ photoLink, title, description} =req.body;
    try{
const newAnnouncement =announcementModel.create({photoLink: photoLink, title: title,description : description , isActive: true});
res.status(200).json({status:"success",data: newAnnouncement})
    } catch(error){
        res.status(500).json({status:"error",data: error})
    }
});
app.get("/all-announcements",async(req,res)=>{
    try{
    const allAnnouncement = await announcementModel.findAll({where:{isActive:true}});
    res.status(200).json({status:"succeess", data: allAnnouncement });
    }catch(error){
        res.status(500).json({status:"error",data: error})
    }
});
app.get("/announcement/:id", async (req,res)=>{
    const { id }= req.params;
    try{
const selectedAnnouncement = await announcementModel.findOne({where:{id:id}});
res.status(200).json({status:"success",data:selectedAnnouncement});
    }catch(error){
        console.log("ERROR!!!", error)
        res.status(500).json({status:"error", data:error})
        
    }
});
app.post("/new-categories",async(req,res)=>{
    const { photoLink, title } = req.body;
    try{
        const newCategory =  categoryModel.create({ photoLink:photoLink, title:title });
        res.status(200).json({status:"success",data: newCategory})
    } catch(error){
        res.status(500).json({status:"error",data: error})
    }
}),
app.get("/all-categories",async(req,res)=>{
    try{
        const allCategories = await categoryModel.findAll();
    res.status(200).json({status:"succeess", data: allCategories });
    }catch(error){
        res.status(500).json({status:"error",data: error})
    }

});
app.get("/category/:id", async (req,res)=>{
    const { id }= req.params;
    try{
        const category = await categoryModel.findOne({ where: { id:id } });
        res.status(200).json({status:"success",data:category});
    }catch(error){
        console.log("ERROR!!!", error)
        res.status(500).json({status:"error", data:error})
    }
});
app.post("/new-product", async(req, res) => {
    const { id, name, photoLink, price, categoryId } = req.body;

    try {
        const newProduct = await productModel.create({ id: id, name: name, photoLink: photoLink,
             price: price, categoryId: categoryId });

        res.status(200).json({ status: "success", data: newProduct });
    } catch(err) {
        res.status(500).json({ status: "error", data: err})
    }
});

app.get("/all-products", async (req, res) => {
    try {
        const allProducts = await productModel.findAll({
            include: {
                model: categoryModel,
                as: "category"
            }
        });

        res.status(200).json({
            status: "success",
            data: allProducts
        });

    } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);
        res.status(500).json({
            status: "error",
            data: error
        });
    }
});

app.get("/products/:categoryId", async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await productModel.findAll({
            where: { categoryId: categoryId },
            include: {
                model: categoryModel,
                as: "category"
            }
        });

        res.status(200).json({
            status: "success",
            data: products
        });

    } catch (error) {
        console.error("CATEGORY PRODUCTS ERROR:", error);
        res.status(500).json({
            status: "error",
            data: error
        });
    }
});

app.get("/product/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productModel.findOne({
            where: { id: id },
            include: {
                model: categoryModel,
                as: "category"
            }
        });

        if (!product) {
            return res.status(404).json({
                status: "error",
                data: "Ürün bulunamadı"
            });
        }

        res.status(200).json({
            status: "success",
            data: product
        });

    } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);
        res.status(500).json({
            status: "error",
            data: error
        });
    }
});

app.post("/new-fav", async (req, res, next) => {
    const { userId, productId } = req.body;

    try {
        const newFav = await favoriteModel.create({ userId: userId, 
            productId: productId });

        res.status(200).json({ status: "success", 
            data: "Favori başarıyla eklendi."});
    } catch(error) {
        res.status(500).json({ status: "error", data: "Favori eklenemedi."});
    }
});

app.get("/favs/:userId", async (req, res, next) => {
    const { userId } = req.params;

    try {
        const favs = await favoriteModel.findAll({
            include: [
                {
                    model: productModel,
                }
            ],
            where: { userId: userId }
        });

        res.status(200).json({ status: "success", data: favs });
    } catch (error) {
        console.log("ERROR!!", error);
        res.status(500).json({ status: "error", data: "Favori bulunamadı." });
    }
});

app.post("/add-product-basket", async (req, res, next) => {
    const { quantity, productId, userId } = req.body;

    try {
        
            await basketModel.create({ userId: userId, productId: productId, quantity: quantity });
        

        const basket = await basketModel.findAll({
            include: [
                {
                    model: productModel,
                    as: "product"
                }
            ],
            where: { userId: userId }
        });

        let basketTotal = 0;

        for(const b of basket) {
            const prodTotal = b.product.price * b.quantity;

            basketTotal += prodTotal;
        }

        res.status(200).json({ status: "success", data: { basket, basketTotal } });
    } catch (error) {
        console.log("error!!!", error);
        res.status(500).json({ status: "error", data: "Sepet getirilemedi."})
    }
})

app.listen(port, () => {
    console.log("Sunucu http://localhost:${port} adresinde çalışıyor");
});