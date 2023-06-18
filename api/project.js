import request from '@/utils/requestUtil'

//获取项目分类
export function getListClass(params) {
	return request({
		method: 'GET',
		url: '/project/categoryTreeList',
		params: params
	});
}

//获取项目列表
export function getList(params) {
	return request({
		method: 'POST',
		url: '/project/search',
		data: params
	});
}

//获取项目详细
export function getDetail(params) {
	return request({
		method: 'POST',
		url: '/project/detail',
		data: params
	});
}
