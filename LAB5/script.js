const myReq = new Request('product.json')
let imgcount = 4;
let globpd;

fetch(myReq).then(response => response.json()).then(
	function(json) {
		let product = json;
		init(product);
	}
).catch(console.error);

function init(product) {
	const fprice = document.getElementById('filterprice')
	const fname = document.getElementById('filtername');
	const fbtn = document.getElementById('filterbtn');
	const pdbox = document.getElementById('pdbox');
    
	let currPrice = fprice.value;
	let currName = '';
	
	let priceFiltered;	// 가격으로 필터링
	let nameFiltered;	// 이름으로 필터링

	nameFiltered = product;
	productUpdate();

	priceFiltered = [];
	nameFiltered = [];

	fbtn.onclick = filterPrice;

	function filterPrice(e) {
		e.preventDefault();

		priceFiltered = [];
		nameFiltered = [];

		if(fprice.value === currPrice && fname.value.trim() === currName) {
			return;
		}
		else {
			currPrice = fprice.value;
			currName = fname.value.trim();

			if(fprice.value === 'all') {
				priceFiltered = product;
				filterName();
			}
			else {
				let price = fprice.value;
				if (price === "5000") {					// 가격 5000 이하
					for(let i = 0; i < product.length; i++){
						if(product[i].price <= 5000) {
							priceFiltered.push(product[i]);
						}
					}
				}
				else if (price === "5001to10000") {		// 가격 5000 초과 10000 이하
					for(let i = 0; i < product.length; i++){
						if(product[i].price > 5000 && product[i].price <= 10000) {
							priceFiltered.push(product[i]);
						}
					}
				}
				else if (price === "10001to15000") {	// 가격 10000 초과 15000 이하
					for(let i = 0; i < product.length; i++){
						if(product[i].price > 10000 && product[i].price <= 15000) {
							priceFiltered.push(product[i]);
						}
					}
				}
				else if (price === "15001") {			// 가격 15000 초과
					for(let i = 0; i < product.length; i++){
						if(product[i].price > 15000) {
							priceFiltered.push(product[i]);
						}
					}
				}
				filterName();
			}
		}
	}

	function filterName() {
		if(fname.value.trim() === '') {		// 검색어 없음
			nameFiltered = priceFiltered;
			productUpdate();
		}
		else {
			let nametosearch = fname.value.trim().toLowerCase();
    
			for(let i = 0; i < priceFiltered.length; i++) {
				if(priceFiltered[i].name.toLowerCase().includes(nametosearch)) {
					nameFiltered.push(priceFiltered[i]);
				}
			}
			productUpdate();
		}
	}
    
	function productUpdate() {
		while (pdbox.firstChild) {
			pdbox.removeChild(pdbox.firstChild);
		}
    
		if(nameFiltered.length === 0) {
			const nresult = document.createElement('p');
			nresult.textContent = 'No Result';
			pdbox.appendChild(nresult);
		}
		else {
			imgcounter = 4;
			globpd = nameFiltered;
			for(let i = 0; i < 4; i++) {
				createImgUrl(nameFiltered[i], i);
			}
		}
	}
    
	function createImgUrl(product, i) {
		let url = './' + product.src;
		showProduct(url, product, i);
	}
    
	function showProduct(imgurl, product, i) {		
		const outerdiv = document.createElement('div');
		const img = document.createElement('img');
		
		const innerdiv = document.createElement('div');
		const pinfo = document.createElement('p');
		
		const click = document.createElement('p');
	
		outerdiv.setAttribute('class', 'pdimg');
	
		img.src = imgurl;
		img.alt = product.name;
		
		innerdiv.setAttribute('class', 'pdinfo');
		innerdiv.id = i;
		innerdiv.style.opacity = "0";
		innerdiv.onclick =
			function() {
				let div =  document.getElementById(this.id);
				if (div.style.opacity === "0") {
					div.style.opacity = "1";
				}
				else {
					div.style.opacity = "0";
				}
			}

		pinfo.innerHTML = 'Product : ' + product.name + '<br/>Price(₩) : ' + product.price;
		
		click.textContent = "Click for detail";

		pdbox.appendChild(outerdiv);
		outerdiv.appendChild(innerdiv);
		innerdiv.appendChild(pinfo);
		outerdiv.appendChild(img);
		outerdiv.appendChild(click);
	}
}

window.addEventListener('scroll', () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	if(clientHeight + scrollTop >= scrollHeight - 10) {
		infscroll();
	}
});

function infscroll() {
	const pdbox = document.getElementById('pdbox');

	var start = imgcount;
	var end = start + 2;
	imgcount = end;
	
	let product = globpd;
	for(start; start < end; start++) {
		const outerdiv = document.createElement('div');
		const img = document.createElement('img');
		
		const innerdiv = document.createElement('div');
		const pinfo = document.createElement('p');
		
		const click = document.createElement('p');

		let url = './' + product[start].src;
    
		outerdiv.setAttribute('class', 'pdimg');
			
		img.src = url;
		img.alt = product.name;

		innerdiv.setAttribute('class', 'pdinfo');
		innerdiv.id = start;
		innerdiv.style.opacity = "0";
		innerdiv.onclick =
			function() {
				let div =  document.getElementById(this.id);
				if (div.style.opacity === "0") {
					div.style.opacity = "1";
				}
				else {
					div.style.opacity = "0";
				}
			}

		pinfo.innerHTML = 'Product : ' + product[start].name + '<br/>Price(₩) : ' + product[start].price;
			
		click.textContent = "Click for detail";
    
		pdbox.appendChild(outerdiv);
		outerdiv.appendChild(innerdiv);
		innerdiv.appendChild(pinfo);
		outerdiv.appendChild(img);
		outerdiv.appendChild(click);
	}
}
