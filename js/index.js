import { getProducts } from './service.js';
import { FILTER_TYPE } from './constant.js';
let productsList = []; // 商品列表

const productWrapDom = document.querySelector('.productWrap');
const productSelectDom = document.querySelector('.productSelect');

const DOM = {
    productWarp: productWrapDom,
    productSelect: productSelectDom
}

async function init() {
    try {
        productsList = await getProducts();
        renderCard(productsList);
    } catch (error) {
        console.log(error);
    }
}

function renderCard(productsList) {
    let tempStr = '';
    tempStr = productsList.map(product => {
        return `
        <li class="productCard">
            <h4 class="productType">新品</h4>
            <img src=${product.images}
                alt=${product.title}>
            <a href="#" class="addCardBtn">加入購物車</a>
            <h3>${product.title}</h3>
            <del class="originPrice">NT$${product.origin_price}</del>
            <p class="nowPrice">NT$${product.price}</p>
        </li>
        `
    }).join('');

    DOM.productWarp.innerHTML = tempStr;
}

DOM.productSelect.addEventListener('change', function (e) {
    let productsListByCategory = e.target.value !== FILTER_TYPE.ALL ? productsList.filter(product => { return product.category === e.target.value }) : productsList;
    renderCard(productsListByCategory);
})



init();