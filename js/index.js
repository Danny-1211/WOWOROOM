import { getProducts } from './service.js';
import { dom } from './constant.js';
let productsList = []; // 商品列表

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

    dom.productWarp.innerHTML = tempStr;

}



init();