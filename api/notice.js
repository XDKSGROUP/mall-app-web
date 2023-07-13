import request from '@/utils/requestUtil'

export function getList(data) {
	return request({
		method: 'POST',
		url: '/home/noticeList',
		data: data
	});
}

export function getInfo(data) {
	return request({
		method: 'POST',
		url: '/home/noticeDetail',
		data: data
	})
}

export function getUnRead(data) {
	return request({
		method: 'POST',
		url: '/notice/unreadNotice',
		data:data
	})
}
