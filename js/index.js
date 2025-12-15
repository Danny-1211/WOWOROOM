import { getProducts, getCarts } from './service.js';
import { FILTER_TYPE } from './constant.js';

let productsList = []; // 商品列表
let cartsList = []; // 購物車列表

const productWrapDom = document.querySelector('.productWrap');
const productSelectDom = document.querySelector('.productSelect');
const shoppingCartTableDom = document.querySelector('.shoppingCart-table');

const DOM = {
    productWarp: productWrapDom,
    productSelect: productSelectDom,
    shoppingCarts: shoppingCartTableDom,
}

async function init() {
    try {
        productsList = await getProducts();
        cartsList = await getCarts();
        renderCard(productsList);
        renderCartList(cartsList);
    } catch (error) {
        console.log(error);
    }
}

// 渲染
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

function renderCartList(cartsList) {
    console.log(cartsList)
    let tempStr = `        
        <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
        </tr>          
    `;
    tempStr += cartsList.carts.map(cart => {
        return `
            <tr>
            <td>
                <div class="cardItem-title">
                    <img src=${cart.product.images} alt=${cart.product.title}>
                    <p>${cart.product.title}</p>
                </div>
            </td>
            <td>${cart.product.price}</td>
            <td>${cart.quantity}</td>
            <td>${cart.product.price * cart.quantity}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons">
                    clear
                </a>
            </td>
        </tr>
        `
    }).join('');

    DOM.shoppingCarts.innerHTML = tempStr;
}

DOM.productSelect.addEventListener('change', function (e) {
    let productsListByCategory = e.target.value !== FILTER_TYPE.ALL ? productsList.filter(product => { return product.category === e.target.value }) : productsList;
    renderCard(productsListByCategory);
})

init();