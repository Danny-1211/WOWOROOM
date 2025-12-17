import { getOrders, deleteAllOrders, deleteSingleOrders } from './service.js';

let ordersList = [];

const orderPageTableDom = document.querySelector('.orderPage-table');
const discardAllBtnDom = document.querySelector('.discardAllBtn');

const DOM = {
    orderPageTable: orderPageTableDom,
    discardAllBtn: discardAllBtnDom,

}

async function init() {
    updateOrderList();
}

async function updateOrderList() {
    try {
        ordersList = await getOrders();
        renderOrderList(ordersList);
    } catch (error) {
        console.log('更新訂單列表發生錯誤', error)
    }
}


function renderOrderList(ordersList) {
    let temp = `                
    <thead>
        <tr>
            <th>訂單編號</th>
            <th>聯絡人</th>
            <th>聯絡地址</th>
            <th>電子郵件</th>
            <th>訂單品項</th>
            <th>訂單日期</th>
            <th>訂單狀態</th>
            <th>操作</th>
        </tr>
    </thead>
    `;

    temp += ordersList.orders.map(order => {
        return `
            <tr>
                <td>${order.id}</td>
                <td>
                    <p>${order.user.name}</p>
                    <p>${order.user.tel}</p>
                </td>
                <td>${order.user.address}</td>
                <td>${order.user.email}</td>
                <td>
                    ${order.products.map(product => {
            return `<p>${product.title} x ${product.quantity}</p>`
        }).join('')}
                </td>
                <td>${new Date(order.createdAt * 1000).toLocaleDateString()}</td>
                <td class="orderStatus">
                    <button type="button">未處理</button>
                </td>
                <td>
                    <input type="button" class="delSingleOrder-Btn" value="刪除" data-id=${order.id}>
                </td>
            </tr>
        `
    }).join('')

    DOM.orderPageTable.innerHTML = temp;
}

DOM.discardAllBtn.addEventListener('click', async function (e) {
    try {
        await deleteAllOrders();
        await updateOrderList();
    } catch (error) {
        console.log('刪除全部資料發生錯誤', error);
    }
})

DOM.orderPageTable.addEventListener('click', async function (e) {
    const btn = e.target.closest('.delSingleOrder-Btn');

    if (!btn) { // 如果找不到這個按鈕防呆
        return;
    }

    const id = btn.dataset.id;

    try {
        await deleteSingleOrders(id);
        await updateOrderList();
    } catch (error) {
        console.log('刪除單筆資料發生錯誤', error);
    }

});

init();