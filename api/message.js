import request from '@/utils/requestUtil'

export function getList(data) {
	return request({
		method: 'POST',
		url: '/message/messageList',
		data: data
	});
}

export function getInfo(data) {
	return request({
		method: 'POST',
		url: '/message/messageDetail',
		data: data
	})
}

export function getUnRead(data) {
	return request({
		method: 'POST',
		url: '/message/unreadMessage',
		data:data
	})
}
