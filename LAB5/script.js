const myReq = new Request('product.json')
let counter = 4;

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
	
	let categoryGroup;
    let finalGroup;

    finalGroup = product;
    updateDisplay();

    categoryGroup = []; // to displayList
    finalGroup = [];

    fbtn.onclick = filterPrice;

    function filterPrice(e) {
        e.preventDefault();

        categoryGroup = [];
        finalGroup = [];

        if(fprice.value === currPrice && fname.value.trim() === currName) {
            return;
        }
		else {
            currPrice = fprice.value;
            currName = fname.value.trim();

            if(fprice.value === 'all') {
                categoryGroup = product;
                filterName();
            }
			else {
                let price = fprice.value;
				if (price === "5000") {
					for(let i = 0; i < product.length; i++){
						if(product[i].price <= 5000) {
							categoryGroup.push(product[i]);
						}
					}
				}
				else if (price === "5001to10000") {
					for(let i = 0; i < product.length; i++){
						if(product[i].price > 5000 && product[i].price <= 10000) {
							categoryGroup.push(product[i]);
						}
					}
				}
				else if (price === "10001to15000") {
					for(let i = 0; i < product.length; i++){
						if(product[i].price > 10000 && product[i].price <= 15000) {
							categoryGroup.push(product[i]);
						}
					}
				}
				else if (price === "15001") {
					for(let i = 0; i < product.length; i++){
						if(product[i].price > 15000) {
							categoryGroup.push(product[i]);
						}
					}
				}
                filterName();
            }
        }
    }

    function filterName() {
        if(fname.value.trim() === '') {
            finalGroup = categoryGroup;
            updateDisplay();
        }
		else {
            let lowerCaseSearchTerm = fname.value.trim().toLowerCase();
    
            for(let i = 0; i < categoryGroup.length; i++) {
                if(categoryGroup[i].name.toLowerCase().includes(lowerCaseSearchTerm)) {
                    finalGroup.push(categoryGroup[i]);
                }
            }
            updateDisplay();
        }
    }
    
    function updateDisplay() {
        while (pdbox.firstChild) {
            pdbox.removeChild(pdbox.firstChild);
        }
    
        if(finalGroup.length === 0) {
            const para = document.createElement('p');
            para.textContent = 'No results to display!';
            pdbox.appendChild(para);
        } else {
            for(let i = 0; i < 4; i++) {
                fetchImg(finalGroup[i], i);
            }
        }
    }
    
    function fetchImg(product, i) {
        let url = './' + product.img;
        showProduct(url, product, i);
    }
    
    function showProduct(objURL, product, i) {
        const outerdiv = document.createElement('div');
        const img = document.createElement('img');
        const innerdiv = document.createElement('div');
        const prompt = document.createElement('p');
        const info = document.createElement('p');
        const price = document.createElement('p');

        outerdiv.setAttribute('class', 'onClickTextOverImage');

        innerdiv.setAttribute('class', 'clickable');
        innerdiv.id = i;
        innerdiv.style.opacity = "0";
        innerdiv.onclick = function(){
            var x = document.getElementById(this.id);
            if(x.style.opacity === "0"){
                x.style.opacity = "1";
            } else if(x.style.opacity === "1"){
                x.style.opacity = "0";
            } else {
                x.style.opacity = "0";
            }
        }

        prompt.textContent = "Click to see more";

        info.textContent = product.name;
        price.textContent = '₩' + product.price;
            
        img.src = objURL;
        img.alt = product.name;

        pdbox.appendChild(outerdiv);
        outerdiv.appendChild(innerdiv);
        innerdiv.appendChild(info);
        innerdiv.appendChild(price)
        outerdiv.appendChild(img);
        outerdiv.appendChild(prompt);
    }
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if(clientHeight + scrollTop >= scrollHeight - 3) {
        load();
    }
});

function load() {
    const pdbox = document.getElementById('pdbox');

    var start = counter;
    var end = start + 3;
    counter = end;

    fetch(myReq).then(response => response.json()).then(function(json) {
        let product = json;
        for(start; start < end; start++) {
            const outerdiv = document.createElement('div');
			const img = document.createElement('img');
			const innerdiv = document.createElement('div');
			const prompt = document.createElement('p');
			const info = document.createElement('p');
			const price = document.createElement('p');

            let url = './' + products[start].img;
    
            outerdiv.setAttribute('class', 'onClickTextOverImage');

            innerdiv.setAttribute('class', 'clickable');
            innerdiv.id = start;
            innerdiv.style.opacity = "0";
            innerdiv.onclick = function(){
                var x = document.getElementById(this.id);
                if(x.style.opacity === "0"){
                    x.style.opacity = "1";
                } else if(x.style.opacity === "1"){
                    x.style.opacity = "0";
                } else {
                    x.style.opacity = "0";
                }
            }

            prompt.textContent = "Click to see more";

            info.textContent = products[start].name;
            price.textContent = '$' + products[start].price;
            
            img.src = url;
            img.alt = products[start].name;
    
            pdbox.appendChild(outerdiv);
			outerdiv.appendChild(innerdiv);
			innerdiv.appendChild(info);
			innerdiv.appendChild(price)
			outerdiv.appendChild(img);
			outerdiv.appendChild(prompt);
        }
    })
        .catch(console.error);
};
