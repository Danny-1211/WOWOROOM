// 打後台 api 並回傳該 data
import { PATH, ADMIN_UID } from './constant.js';

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


export {
    getOrders
}