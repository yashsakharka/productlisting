const productGrid = document.querySelector('#productItems');
const productResultsCount = document.querySelector('#allProducts');
const shimmerEffectContainer = document.querySelector('#shimmerContainer');
const expandProductList = document.querySelector('#moreButton');
const categoryFilterCheckboxes = document.querySelectorAll('.filter__category-checkbox');
const sortByDropdown = document.querySelector('#sort');
const searchBar = document.querySelector('#searchInput');

let productInfo = [];
let availableProductCount = 0;
let sortedProductItems = [];

async function fetchAllProducts() {
    activateShimmer();  
    try {
        const res = await fetch('https://fakestoreapi.com/products',{mode:'cors'});
        if (res.ok) {
            const data = await res.json();
            productInfo = data;
            productResultsCount.textContent = `${productInfo.length} Results`;
            displayProductDetails();
        }
         
    } catch (error) {
        console.error('Error:', error);
        errorBlockRender('Products Not Available');
    } finally {
        deactivateShimmer();
    }
}

function activateShimmer() {
    shimmerEffectContainer.style.display = 'grid'; 
    productGrid.style.display = 'none';  
}

function deactivateShimmer() {
    shimmerEffectContainer.style.display = 'none'; 
    productGrid.style.display = 'grid';  
}

function errorBlockRender(message) {
    const errorBlock = Object.assign(document.createElement('div'), {
        className: 'error-msg', innerHTML: `<b>${message}</b>`
    });
    productGrid.appendChild(errorBlock);
}

function displayProductDetails() {
    let errorContainer = document.querySelector(".error-msg");
    if(!errorContainer){ 
    sortedProductItems = filterProductInfo(productInfo);
    const arrangedProducts = arrangeProducts(sortedProductItems);
    const productGroup = arrangedProducts.slice(availableProductCount, availableProductCount + 10);
    if (availableProductCount === 0) {
        productGrid.innerHTML = ''; 
    }
    if (productGroup.length === 0) {
        expandProductList.style.display = 'none'; 
        return;
    }
    productGroup.forEach(product => {
        const productUnit = document.createElement('div');
        productUnit.classList.add('products__item');
        productUnit.innerHTML = `
            <div class="product__image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product__description">
                <p class="product_title">${product.title}</p>
                <p class="price">$${product.price}</p>
                <button class="products__like-button" aria-label="Like button">🤍</button>
            </div>`;

        const heartBtn = productUnit.querySelector('.products__like-button');
        heartBtn.addEventListener('click', () => {
            if (heartBtn.classList.toggle('liked')) {
                heartBtn.innerHTML = '❤️'; 
            } else {
                heartBtn.innerHTML = '🤍'; 
            }
        });

        productGrid.appendChild(productUnit);
    });

    availableProductCount += productGroup.length; 
        if (availableProductCount >= arrangedProducts.length) {
            expandProductList.style.display = 'none'; 
        } else {
            expandProductList.style.display = 'block'; 
        }    
    }

}

function filterProductInfo(products) {
    const searchTerm = searchBar.value.toLowerCase();
    const categoryChecked = Array.from(categoryFilterCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const filtered = products.filter(product => {
        const searchTermMatch = product.title.toLowerCase().includes(searchTerm);
        const checkedCategoryMatch = categoryChecked.length > 0 ? categoryChecked.includes(product.category) : true; 
        return searchTermMatch && checkedCategoryMatch;
    });
    productResultsCount.textContent = `${filtered.length} Results`; 
    if (availableProductCount >= filtered.length) {
        availableProductCount = 0; 
    }
    return filtered; 
}


function arrangeProducts(products) {
    const sortBy = sortByDropdown.value;
    if (sortBy === 'low-to-high') {
        return products.sort((x, y) => x.price - y.price);
    } else if (sortBy === 'high-to-low') {
        return products.sort((x, y) => y.price - x.price);
    }
    return products;
}

expandProductList.addEventListener('click', displayProductDetails);

sortByDropdown.addEventListener('change', () => {
    availableProductCount = 0; 
    displayProductDetails();    
});

searchBar.addEventListener('input', () => {
    availableProductCount = 0; 
    displayProductDetails();     
});

categoryFilterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
    availableProductCount = 0; 
    displayProductDetails(); 
      
    });
});

window.onload = fetchAllProducts;

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const filters = document.querySelector('.filter');

    hamburger.addEventListener('click', () => {
        filters.classList.toggle('active');
    });
});
