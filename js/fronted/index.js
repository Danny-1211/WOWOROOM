import { getProducts, getCarts, addCarts, deleteAllCarts, deleteSingleCart, addClientOrder } from './service.js';
import { FILTER_TYPE } from './constant.js';

let productsList = []; // 商品列表
let cartsList = []; // 購物車列表

const productWrapDom = document.querySelector('.productWrap');
const productSelectDom = document.querySelector('.productSelect');
const shoppingCartTableDom = document.querySelector('.shoppingCart-table');
const orderFormDom = document.querySelector('.orderInfo-form');
const overflowWrapDom = document.querySelector('.overflowWrap');

const DOM = {
    productWarp: productWrapDom,
    productSelect: productSelectDom,
    shoppingCarts: shoppingCartTableDom,
    orderForm: orderFormDom,
    overflowWrap: overflowWrapDom
}

const INPUT_DOM = {
    name: document.querySelector('#customerName'),
    phone: document.querySelector('#customerPhone'),
    email: document.querySelector('#customerEmail'),
    address: document.querySelector('#customerAddress'),
    payment: document.querySelector('#tradeWay'),
    submitBtn: document.querySelector('.orderInfo-btn')
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
    let hasData = cartsList.carts.length > 0;
    let tempStr = '';
    if (!hasData) {
        tempStr += `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px 0;">
                    <p>購物車暫無商品，趕快去選購吧！</p>
                </td>
            </tr>
        `;
    } else {
        tempStr = `        
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

function validForm() {
    let isValid = true;

    // 當購物車沒有商品
    if (cartsList.carts.length === 0) {
        isValid = false;
        Swal.fire({
            icon: 'error',
            title: '購物車沒有商品',
            timer: 2000,
            showConfirmButton: false
        });
        return isValid;
    }

    const cols = [
        { key: 'name', msgName: 'customerName' },
        { key: 'phone', msgName: 'customerPhone' },
        { key: 'email', msgName: 'customerEmail' },
        { key: 'address', msgName: 'customerAddress' }
    ];

    cols.forEach(col => {
        const input = INPUT_DOM[col.key];
        let message = document.querySelector(`.orderInfo-${col.msgName}-message`);
        if (input.value.trim() === '') {
            message.textContent = '必填';
            input.classList.add('error');
            isValid = false;
        } else {
            message.innerHTML = '';
            input.classList.remove('error');
        }
    })

    return isValid;
}

async function submitOrder(e) {
    e.preventDefault();

    if (!validForm()) {
        return;
    }

    const confirmResult = await Swal.fire({
        title: '確定要送出訂單嗎？',
        text: "送出後將開始處理您的訂單",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#6A33F8',
        cancelButtonColor: '#aaa',
        confirmButtonText: '是的，送出！',
        cancelButtonText: '再檢查一下'
    });

    // 如果使用者點擊取消，則中斷函式
    if (!confirmResult.isConfirmed) return;

    Swal.fire({
        title: '正在處理訂單...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let obj = {
        name: INPUT_DOM.name.value,
        tel: INPUT_DOM.phone.value,
        email: INPUT_DOM.email.value,
        address: INPUT_DOM.address.value,
        payment: INPUT_DOM.payment.value
    }

    let para = {
        "data": {
            "user": obj
        }
    }

    try {
        await addClientOrder(para);
        await updateCart();
        await Swal.fire({
            icon: 'success',
            title: '訂單建立成功！',
            timer: 2000,
            showConfirmButton: false
        });
        DOM.orderForm.reset();
    } catch (error) {
        console.error('建立訂單失敗', error);
        Swal.fire({
            icon: 'error',
            title: '訂單送出失敗',
            text: '伺服器似乎出了點問題，請稍後再試。'
        });
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

    let quantity = !(cartsList.carts.find(cart => cart.product.id == addCardBtn.dataset.id)) ? 0 : cartsList.carts.find(cart => cart.product.id == addCardBtn.dataset.id).quantity

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
        await Swal.fire({
            icon: 'success',
            title: '加入購物車成功！',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('新增購物車失敗', error);
        await Swal.fire({
            icon: 'error',
            title: '加入購物車失敗',
            timer: 2000,
            showConfirmButton: false
        });
    }
})

// 刪除購物車全部品項 & 刪除單筆購物車內容
DOM.shoppingCarts.addEventListener('click', async function (e) {
    const btn = e.target.closest('.actionBtn');

    if (!btn) { // 如果找不到這個按鈕防呆
        return;
    }


    const confirmResult = await Swal.fire({
        title: '確定要送出訂單嗎？',
        text: "送出後將開始處理您的訂單",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#6A33F8',
        cancelButtonColor: '#aaa',
        confirmButtonText: '是的，送出！',
        cancelButtonText: '再檢查一下'
    });


    if (!confirmResult.isConfirmed) return;


    const action = btn.dataset.action;



    switch (action) {
        case 'discardAllBtn':
            try {
                await deleteAllCarts();
                await updateCart();
                await Swal.fire({
                    icon: 'success',
                    title: '已刪除所有品項！',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('刪除全部購物車失敗', error);
                await Swal.fire({
                    icon: 'error',
                    title: '刪除全部購物車失敗',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            break;
        case 'discardSingleBtn':
            try {
                const cartItemId = btn.dataset.id
                await deleteSingleCart(cartItemId);
                await updateCart();
                await Swal.fire({
                    icon: 'success',
                    title: '已刪除成功！',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('刪除單筆購物車失敗', error);
                await Swal.fire({
                    icon: 'error',
                    title: '刪除單筆購物車失敗',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
    }
})

INPUT_DOM.submitBtn.addEventListener('click', submitOrder)




init();