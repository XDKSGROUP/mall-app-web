import request from '@/utils/requestUtil'

export function getInfo(data) {
	return request({
		method: 'POST',
		url: '/home/helpDetail',
		data: data
	})
}
