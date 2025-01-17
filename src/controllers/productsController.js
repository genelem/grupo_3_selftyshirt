const fs = require('fs');
const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
var uniqid = require('uniqid');
const { name } = require('ejs');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function setImgDefault(product) {
	if (product.category === 'socks') {
		return 'image-default-socks.jpg';
	}
	if (product.category === 'hoodie') {
		return 'image-default-hoodie.jpg';
	}
	if (product.category === 'tshirt') {
		return 'image-default-tshirt.jpg';
	}
}

const Product = db.Product;

const controller = {
	// Root - Show all products
	// index: (req, res) => {
	// 	res.render('products/productList', {
	// 		products,
	// 		toThousand,
	// 	});
	// },
	index: (req, res) => {
        Product.findAll()
            .then(products => {
                res.render('products/productList.ejs', {products, toThousand});
            })
    },
	// Detail - Detail from one product
	// detail: (req, res) => {
	// 	let id = req.params.id;
	// 	let product = products.find((product) => product.id == id);
	// 	res.render('products/productDetail', {
	// 		product,
	// 		toThousand,
	// 	});
	// },
	'detail': (req, res) => {
        Product.findByPk(req.params.id)
            .then(product => {
                res.render('products/productDetail.ejs', {			product,
					toThousand});
            });
    },

	// Create - Form to create
	create: (req, res) => {
		res.render('products/productCreate');
	},

	// Create -  Method to store
	store: async (req, res) => {
		let newProduct = {
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			discount: req.body.discount,
			stock: req.body.stockquantity,
			category_id: req.body.category,
			image: '',
		};
		newProduct.image =  req.file ? req.file.filename : setImgDefault(newProduct);
		let productCreated = await Product.create(newProduct);
		res.redirect('/products/detail/' + productCreated.id);
	},

	cart: (req, res) => {
		res.render('products/productCart');
	},
	// Update - Form to edit
	edit: (req, res) => {
		Product.findByPk(req.params.id).then((product) => {
			res.render('products/productEdit', { productToEdit : product });
		});
	},
	
	// Update - Method to update
	update: async (req, res) => {
		let productId = req.params.id;
        Product.update(
        {
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			discount: req.body.discount,
			stock: req.body.stockquantity,
			category_id: req.body.category,
			// if (!req.file) {
			// 	console.log('No file received');
			// } else {
			// 	productToEdit.image = req.file.filename;
        },
        {
            where: {id: [productId]}
        }).then(() => {
			res.redirect('/products/detail/' + productId);
		});
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		Product.destroy({
			where: {
				id: req.params.id,
			}, force: true
		}).then(() => {
			res.redirect('/products');
		});
	},
};

// Acá exportamos el resultado
module.exports = controller;
