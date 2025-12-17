import { getOrders, deleteAllOrders, deleteSingleOrders, ModifyOrderStatus } from './service.js';

let ordersList = [];

const orderPageTableDom = document.querySelector('.orderPage-table');
const discardAllBtnDom = document.querySelector('.discardAllBtn');

const DOM = {
    orderPageTable: orderPageTableDom,
    discardAllBtn: discardAllBtnDom,
}

async function init() {
    await updateOrderList();
}

async function updateOrderList() {
    try {
        ordersList = await getOrders();
        renderOrderList(ordersList);
        renderChart();
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
                    <button type="button" class="actionBtn" data-id=${order.id}  data-paid=${order.paid}  data-action="status">${!order.paid ? '未處理' : '已處理'}</button>
                </td>
                <td>
                    <input type="button" class="delSingleOrder-Btn actionBtn" value="刪除" data-id=${order.id} data-action="delete">
                </td>
            </tr>
        `
    }).join('')

    DOM.orderPageTable.innerHTML = temp;
}

function renderChart() {
    console.log('ordersList', ordersList);
    let columns = [];
    ordersList.orders.forEach(order => {
        let arr = [];
        arr = order.products.map(product => [product.title, product.quantity]);
        columns.push(arr);
    });

    columns = Object.entries(
        columns.flat().reduce((sum, [title, quantity]) => {
            sum[title] = (sum[title] || 0) + quantity;
            return sum;
        }, {})
    );
    
    console.log(columns);
    let chart = c3.generate({
        bindto: "#chart",
        data: {
            columns: columns,
            type: 'pie'
        }
    });
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
    const btn = e.target.closest('.actionBtn');

    if (!btn) { // 如果找不到這個按鈕防呆
        return;
    }


    const action = btn.dataset.action;

    switch (action) {
        case 'status':
            try {
                const paid = !JSON.parse(btn.dataset.paid);
                const id = btn.dataset.id;
                let obj = {
                    data: {
                        "id": id,
                        "paid": paid
                    }
                }
                await ModifyOrderStatus(obj);
                await updateOrderList();
            } catch (error) {
                console.error('更新訂單狀態失敗', error);
            }
            break;
        case 'delete':
            try {
                const id = btn.dataset.id;
                await deleteSingleOrders(id);
                await updateOrderList();
            } catch (error) {
                console.log('刪除單筆資料發生錯誤', error);
            }
        default:
            break;
    }





});

init();



