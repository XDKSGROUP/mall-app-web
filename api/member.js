import request from '@/utils/requestUtil'

export function memberLogin(data) {
	return request({
		method: 'POST',
		url: '/sso/login',
		// header: {
		// 	'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		// },
		data: data
	})
}

export function memberInfo() {
	return request({
		method: 'GET',
		url: '/member/info/info'
	})
}

//获取指定会员信息
export function getMemberInfo(params) {
	return request({
		method: 'POST',
		url: '/member/info/getModelByUsername',
		data: params
	})
}

//注册会员信息
export function addMember(params) {
	return request({
		method: 'POST',
		url: '/sso/register2',
		data: params
	})
}

//注册会员信息
export function addMember2(params) {
	return request({
		method: 'POST',
		url: '/sso/register3',
		data: params
	})
}
