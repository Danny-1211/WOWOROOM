import { getOrders, deleteAllOrders, deleteSingleOrders, ModifyOrderStatus } from './service.js';

let ordersList = [];

const orderPageTableDom = document.querySelector('.orderPage-table');
const discardAllBtnDom = document.querySelector('.discardAllBtn');
const chartDom = document.querySelector('#chart');
const nodataTipDom = document.querySelector('.section-noDataTip');

const DOM = {
    orderPageTable: orderPageTableDom,
    discardAllBtn: discardAllBtnDom,
    chart: chartDom,
    nodataTip: nodataTipDom
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

    if (ordersList.orders.length === 0 || !ordersList.orders) {
        DOM.chart.style.display = 'none';
        DOM.nodataTip.style.display = 'block';
        return;
    } else {
        DOM.chart.style.display = 'block';
        DOM.nodataTip.style.display = 'none';
    }

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
        const confirmResult = await Swal.fire({
            title: '確定要刪除全部訂單嗎',
            text: "送出後將開始處理您的訂單",
            icon: 'danger',
            showCancelButton: true,
            confirmButtonColor: '#C72424',
            cancelButtonColor: '#aaa',
            confirmButtonText: '是的，送出！',
            cancelButtonText: '再檢查一下'
        });

        if (!confirmResult.isConfirmed) return;

        Swal.fire({
            title: '正在更新訂單狀態...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        await deleteAllOrders();
        await updateOrderList();
        Swal.fire({
            icon: 'success',
            title: '刪除全部訂單成功！',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.log('刪除全部資料發生錯誤', error);
        Swal.fire({
            icon: 'error',
            title: '刪除全部訂單失敗',
            timer: 2000,
            showConfirmButton: false
        });
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

                const confirmResult = await Swal.fire({
                    title: '確定要修改訂單狀態嗎',
                    text: "送出後將開始處理您的訂單",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#6A33F8',
                    cancelButtonColor: '#aaa',
                    confirmButtonText: '是的，送出！',
                    cancelButtonText: '再檢查一下'
                });

                if (!confirmResult.isConfirmed) return;

                Swal.fire({
                    title: '正在更新訂單狀態...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await ModifyOrderStatus(obj);
                await updateOrderList();
                Swal.fire({
                    icon: 'success',
                    title: '更新訂單成功！',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('更新訂單狀態失敗', error);
                Swal.fire({
                    icon: 'error',
                    title: '更新訂單狀態失敗',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            break;
        case 'delete':
            try {
                const id = btn.dataset.id;
                const confirmResult = await Swal.fire({
                    title: '確定刪除這筆訂單嗎',
                    text: "送出後將開始處理您的訂單",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#6A33F8',
                    cancelButtonColor: '#aaa',
                    confirmButtonText: '是的，送出！',
                    cancelButtonText: '再檢查一下'
                });

                if (!confirmResult.isConfirmed) return;
                await deleteSingleOrders(id);
                await updateOrderList();
                Swal.fire({
                    icon: 'success',
                    title: '刪除成功！',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.log('刪除單筆資料發生錯誤', error);
                Swal.fire({
                    icon: 'error',
                    title: '刪除單筆資料失敗',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        default:
            break;
    }





});

init();



