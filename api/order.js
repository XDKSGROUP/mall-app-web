import request from '@/utils/requestUtil'

export function generateConfirmOrder(data) {
	return request({
		method: 'POST',
		url: '/order/generateConfirmOrder',
		data: data
	})
}

export function generateOrder(data) {
	return request({
		method: 'POST',
		url: '/order/generateOrder',
		data: data
	})
}

export function fetchOrderList(params) {
	return request({
		method: 'GET',
		url: '/order/list',
		params: params
	})
}

export function fetchOrderDetail(orderId) {
	return request({
		method: 'GET',
		url: `/order/detail/${orderId}`
	})
}

export function cancelUserOrder(data) {
	return request({
		method: 'POST',
		url: '/order/cancelUserOrder',
		data: data
	})
}

export function confirmReceiveOrder(data) {
	return request({
		method: 'POST',
		url: '/order/confirmReceiveOrder',
		data: data
	})
}

export function deleteUserOrder(data) {
	return request({
		method: 'POST',
		url: '/order/deleteOrder',
		data: data
	})
}
/**支付订单*/
export function payOrderSuccess(data) {
	return request({
		method: 'POST',
		url: '/order/paySuccess',
		data: data
	})
}
/**支付产品订单（等同于payOrderSuccess）*/
export function payOrderProduct(data) {
	return request({
		method: 'POST',
		url: '/order/payOrder',
		data: data
	})
}

/**支付项目订单*/
export function payOrderProject(data) {
	return request({
		method: 'POST',
		url: '/projectOrder/createOrder',
		data: data
	})
}

/**申请退货*/
export async function applyRefund(data) {
	return request({
		method: 'POST',
		url: '/returnApply/create',
		data: data
	})
}

/**退货列表*/
export async function listRefund(data) {
	return request({
		method: 'POST',
		url: '/returnApply/list',
		data: data
	})
}

/**退货详细*/
export async function detailRefund(data) {
	return request({
		method: 'POST',
		url: '/returnApply/detail',
		data: data
	})
}

/**填写退货信息*/
export async function setRefundGoods(data) {
	return request({
		method: 'POST',
		url: '/returnApply/fill',
		data: data
	})
}

/**撤销退款*/
export async function cancelRefund(data) {
	return request({
		method: 'POST',
		url: '/returnApply/revoke',
		data: data
	})
}
