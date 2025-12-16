import { getProducts, getCarts, addCarts, deleteAllCarts, deleteSingleCart } from './service.js';
import { FILTER_TYPE } from './constant.js';

let productsList = []; // 商品列表
let cartsList = []; // 購物車列表

const productWrapDom = document.querySelector('.productWrap');
const productSelectDom = document.querySelector('.productSelect');
const shoppingCartTableDom = document.querySelector('.shoppingCart-table');


const DOM = {
    productWarp: productWrapDom,
    productSelect: productSelectDom,
    shoppingCarts: shoppingCartTableDom
}

// 初始化
async function init() {
    try {
        productsList = await getProducts();
        renderCard(productsList);
        updateCart();
    } catch (error) {
        console.log(error);
    }
}

// 渲染商品列表卡片
function renderCard(productsList) {
    let tempStr = '';
    tempStr = productsList.map(product => {
        return `
        <li class="productCard">
            <h4 class="productType">新品</h4>
            <img src=${product.images}
                alt=${product.title}>
            <button type="button" class="addCardBtn" data-id=${product.id} data-count=${1} >加入購物車</button>
            <h3>${product.title}</h3>
            <del class="originPrice">NT$${product.origin_price.toLocaleString()}</del>
            <p class="nowPrice">NT$${product.price.toLocaleString()}</p>
        </li>
        `
    }).join('');

    DOM.productWarp.innerHTML = tempStr;
}

// 渲染購物車列表
function renderCartList(cartsList) {
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
            <td>${cart.product.price.toLocaleString()}</td>
            <td>${cart.quantity}</td>
            <td>${(cart.product.price * cart.quantity).toLocaleString()}</td>
            <td class="discardBtn">
                <button type="button" class="material-icons actionBtn"  data-action="discardSingleBtn" data-id=${cart.id}>
                    clear
                </button>
            </td>
        </tr>
        `
    }).join('');

    if (cartsList.carts.length !== 0) {
        tempStr += `
            <tr>
                <td>
                    <button type="button"  class="discardAllBtn actionBtn" data-action="discardAllBtn">刪除所有品項</button>
                </td>
                <td></td>
                <td></td>
                <td>
                    <p>總金額</p>
                </td>
                <td>NT$${cartsList.finalTotal.toLocaleString()}</td>
            </tr>
        `
    }

    DOM.shoppingCarts.innerHTML = tempStr;
}

// 更新購物車列表
async function updateCart() {
    try {
        cartsList = await getCarts();
        renderCartList(cartsList);
    } catch (error) {
        console.error('更新購物車失敗', error);
    }
}

// 目錄選擇
DOM.productSelect.addEventListener('change', function (e) {
    let productsListByCategory = e.target.value !== FILTER_TYPE.ALL ? productsList.filter(product => { return product.category === e.target.value }) : productsList;
    renderCard(productsListByCategory);
})

// 加入購物車按鈕
DOM.productWarp.addEventListener('click', async function (e) {
    const addCardBtn = e.target.closest('.addCardBtn');

    if (!addCardBtn) { // 如果找不到這個按鈕防呆
        return;
    }

    let quantity = !(cartsList.carts.find(cart => cart.product.id == addCardBtn.dataset.id)) ? 1 : cartsList.carts.find(cart => cart.product.id == addCardBtn.dataset.id).quantity

    quantity += Number(addCardBtn.dataset.count);

    let para = {
        "data": {
            productId: addCardBtn.dataset.id,
            quantity: quantity
        }
    }

    try {
        await addCarts(para);
        await updateCart();
    } catch (error) {
        console.error('新增購物車失敗', error);
    }
})

// 刪除購物車全部品項 & 刪除單筆購物車內容
DOM.shoppingCarts.addEventListener('click', async function (e) {
    const btn = e.target.closest('.actionBtn');

    if (!btn) { // 如果找不到這個按鈕防呆
        return;
    }

    const action = btn.dataset.action;

    switch (action) {
        case 'discardAllBtn':
            try {
                await deleteAllCarts();
                await updateCart();
            } catch (error) {
                console.error('刪除全部購物車失敗', error);
            }
            break;
        case 'discardSingleBtn':
            try {
                const cartItemId = btn.dataset.id
                await deleteSingleCart(cartItemId);
                await updateCart();
            } catch (error) {
                console.error('刪除全部購物車失敗', error);
            }
    }



})

init();