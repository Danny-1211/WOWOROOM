// 打後台 api 並回傳該 data
import { PATH, ADMIN_UID } from './constant.js';

// 取得後台訂單列表
async function getOrders() {
    const para = {
        headers: {
            'Authorization': ADMIN_UID
        }
    }
    try {
        const res = await axios.get(PATH.ORDERS, para);
        return res.data;
    } catch (error) {
        console.log('取得後台訂單列表發生錯誤', error);
    }
}

// 刪除全部訂單
async function deleteAllOrders() {
    const para = {
        headers: {
            'Authorization': ADMIN_UID
        }
    }
    try {
        const res = await axios.delete(PATH.ORDERS, para);
    } catch (error) {
        console.log('刪除全部訂單發生錯誤', error)
    }
}

// 刪除單筆訂單
async function deleteSingleOrders(id) {
    const para = {
        headers: {
            'Authorization': ADMIN_UID
        }
    }
    try {
        const res = await axios.delete(`${PATH.ORDERS}/${id}`, para)
    } catch (error) {
        console.log('刪除單筆訂單發生錯誤', error)
    }
}

// 修改訂單狀態
async function ModifyOrderStatus(para) {
    const uid = {
        headers: {
            'Authorization': ADMIN_UID
        }
    }
    try {
        const res = await axios.put(`${PATH.ORDERS}`, para, uid)
    } catch (error) {
        console.log('修改訂單狀態發生錯誤', error);
    }
}

export {
    getOrders,
    deleteAllOrders,
    deleteSingleOrders,
    ModifyOrderStatus
}