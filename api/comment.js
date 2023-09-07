import request from '@/utils/requestUtil'

export function getList(data) {
	return request({
		method: 'POST',
		url: '/comment/list',
		data: data
	});
}

export function getMyList(data) {
	return request({
		method: 'POST',
		url: '/comment/myCommentList',
		data: data
	});
}
export function getInfo(data) {
	return request({
		method: 'POST',
		url: '/comment/detail',
		data: data
	})
}

export function setInfo(data) {
	return request({
		method: 'POST',
		url: '/order/comment',
		data:data
	})
}

export function setInfoAppend(data) {
	return request({
		method: 'POST',
		url: '/order/addedComment',
		data:data
	})
}
