const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const controller = {
	index: (req, res, next) => {
	//console.log(req.session.usuarioLogueado)
  res.render('index', { title: 'Inicio' });
},

	search: (req, res) => {
		
		let search = req.query.keywords.toLowerCase();
		let productsToSearch = products.filter((product) => product.name.toLowerCase().includes(search));
		res.render('results', {
			products: productsToSearch,
			search,
			toThousand,
		});
	},
};

module.exports = controller;
