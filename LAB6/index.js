const express = require("express");
const fs = require("fs");
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const ejs = require("ejs");

app.set('view engine', 'ejs');
app.set('views', './page');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('page'));

async function getDBConnection() {
	const db = await sqlite.open({
		filename: './page/product.db',
		driver: sqlite3.Database
	});
	return db;
}

app.get('/', async function(req, res) {
	let db = await getDBConnection();
	let lists = await db.all('SELECT * FROM fruits');
	await db.close();
	
	var id = [];
	var path = [];
	var name = [];
	
	for (var i = 0; i < lists.length; i++) {
		id[i] = lists[i]['product_id'];
		path[i] = lists[i]['product_image'];
		name[i] = lists[i]['product_title'];
	}
	
	res.render("index", {num: lists.length, pd_id: id, img_path: path, pd_name: name});
});

app.post('/', async function(req, res) {

	let db = await getDBConnection();

	const fname = req.body.filtername;
	const fcat = req.body.filterprice;
	let query;
	
	if(fname.trim() === '') {
		query = 'SELECT * FROM fruits';
		if (fcat === "5000") {					// 가격 5000 이하
			query += ' WHERE product_category = "very cheap"';
		}
		else if (fcat === "5001to10000") {		// 가격 5000 초과 10000 이하
			query += ' WHERE product_category = "cheap"';
		}
		else if (fcat === "10001to15000") {		// 가격 10000 초과 15000 이하
			query += ' WHERE product_category = "middle"';
		}
		else if (fcat === "15001") {			// 가격 15000 초과
			query += ' WHERE product_category = "expensive"';
		}
	}
	else {
		query = 'SELECT * FROM fruits WHERE product_title LIKE "%' + fname + '%"';
		if (fcat === "5000") {					// 가격 5000 이하
			query += ' AND product_category = "very cheap"';
		}
		else if (fcat === "5001to10000") {		// 가격 5000 초과 10000 이하
			query += ' AND product_category = "cheap"';
		}
		else if (fcat === "10001to15000") {		// 가격 10000 초과 15000 이하
			query += ' AND product_category = "middle"';
		}
		else if (fcat === "15001") {			// 가격 15000 초과
			query += ' AND product_category = "expensive"';
		}
	}
	
	console.log(query);

	let lists = await db.all(query);
	await db.close();
	
	var id = [];
	var path = [];
	var name = [];
	
	for (var i = 0; i < lists.length; i++) {
		id[i] = lists[i]['product_id'];
		path[i] = lists[i]['product_image'];
		name[i] = lists[i]['product_title'];
	}
	
	res.render("index", {num: lists.length, pd_id: id, img_path: path, pd_name: name});
});

app.get('/product/:num', async function(req, res) {
	let db = await getDBConnection();
	let pd = await db.all('SELECT * FROM fruits');
	console.log("Entered Product Page (Product ID : " + req.params.num + ")");
	await db.close();
	
	fs.readFile('./page/comment.json', 'utf8', async function (error, data) {
		if (error) return console.log(error);
		let comments = JSON.parse(data);
		let pdcomments = [];
		for (var i = 0; i < comments.length; i++) {
			if (comments[i].id == req.params.num) {
				pdcomments.unshift(comments[i].comment);
			}
		}
		res.render("product_info", {pd_id: req.params.num, num: pdcomments.length, commenthere: pdcomments, img_path: '../' + pd[req.params.num - 1]['product_image'], pd_name: pd[req.params.num - 1]['product_title'], pd_price: pd[req.params.num - 1]['product_price']});
	});
});

app.get('/login', function(req, res) {
	res.render("login", {});
});

app.get('/signup', function(req, res) {
	res.render("signup", {});
});

app.post('/product/:num', async function (req, res) {
	let db = await getDBConnection();
	let pd = await db.all('SELECT * FROM fruits');
	await db.close();
	
	var data = fs.readFileSync('./page/comment.json');
	var comments = JSON.parse(data);
	
	var newcomments = {
		"id": req.params.num,
		"comment": req.body.comment
	};
	comments.push(newcomments);
	
	var myjson = JSON.stringify(comments);
	fs.writeFile('./page/comment.json', myjson, err => {
		if (err) throw err;
	});
	console.log("Comment Leaved : " + req.body.comment + " (Product ID : " + req.params.num + ")");
	res.redirect(req.originalUrl)
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("SERVER ON");
});