import request from '@/utils/requestUtil'
import {
	mapMutations
} from 'vuex';

//获取验证码
export async function getVerifyCode(params) {
	return request({
		method: 'GET',
		url: '/sso/getAuthCode',
		params: params
	});
}

//获取所有资金变动明细
export function getListChangeMoneys(params) {
	return request({
		method: 'POST',
		url: '/member/moneyDetails/list',
		data: params
	});
}

//更新登录密码
export function setLoginPassword(params) {
	return request({
		method: 'POST',
		url: '/sso/updatePassword',
		data: params
	});
}
//更新登录密码
export function setLoginPassword2(params) {
	return request({
		method: 'POST',
		url: '/sso/updatePassword2',
		params: params
	});
}

//更新交易密码2
export function setPayPassword(params) {
	return request({
		method: 'POST',
		url: '/sso/updatePaymentPassword',
		params: params
	});
}
//更新交易密码2
export function setPayPassword2(params) {
	return request({
		method: 'POST',
		url: '/sso/updatePassword2',
		params: params
	});
}

//更新手机号
export function setMobile(params) {
	return request({
		method: 'POST',
		url: '/sso/changeTelephone',
		params: params
	});
}

//更新会员信息
export function setMemberInfo(params) {
	return request({
		method: 'POST',
		url: '/sso/updateMemberInfo',
		data: params
	});
}

//获取银行卡列表
export function getListBankCard(params) {
	return request({
		method: 'GET',
		url: '/member/bankCard/list',
		params: params
	});
}

//获取银行卡列表
export function getBankCard(params) {
	return request({
		method: 'GET',
		url: '/member/bankCard/' + params.id,
	});
}

//删除银行卡
export function delBankCard(params) {
	return request({
		method: 'POST',
		url: '/member/bankCard/delete/' + params.id,
	});
}

//更新银行卡信息
export function setBankCard(params) {
	return request({
		method: 'POST',
		url: '/member/bankCard/update/' + params.id,
		data: params
	});
}

//添加银行卡信息
export function addBankCard(params) {
	return request({
		method: 'POST',
		url: '/member/bankCard/add',
		data: params
	});
}

//添加申购(充值)信息
export function addRecharge(params) {
	return request({
		method: 'POST',
		url: '/member/rechargeRecord/add',
		data: params
	});
}
//获取申购(充值)信息列表
export function getListRecharge(params) {
	return request({
		method: 'POST',
		url: '/member/rechargeRecord/list',
		data: params
	});
}

//添加我的传递(转帐)信息
export function addTransferRecord(params) {
	return request({
		method: 'POST',
		url: '/member/transferRecord/add',
		data: params
	});
}
//获取我的传递(转帐)信息
export function getListTransferRecord(params) {
	return request({
		method: 'POST',
		url: '/member/transferRecord/list',
		data: params
	});
}

//添加我的提现(转帐)信息
export function addWithdrawalRecord(params) {
	return request({
		method: 'POST',
		url: '/member/withdrawalsRecord/add',
		data: params
	});
}
//添加我的提现(转帐)信息
export function getListWithdrawalRecord(params) {
	return request({
		method: 'POST',
		url: '/member/withdrawalsRecord/list',
		data: params
	});
}

//获取我的信息
export function getMeInfo() {
	return request({
		method: 'GET',
		url: '/sso/info'
	})
}

//获取我的邀请信息
export function getInviteList(params) {
	return request({
		method: 'POST',
		url: '/member/info/inviterList',
		data: params
	})
}

//添加项目关注
export function addProjectAttention(params) {
	return request({
		method: 'POST',
		url: '/member/projectAttention/add',
		data: params
	})
}
//删除项目关注
export function delProjectAttention(params) {
	return request({
		method: 'POST',
		url: '/member/projectAttention/delete',
		data: params
	})
}
//获取项目关注
export function getProjectAttention(params) {
	return request({
		method: 'POST',
		url: '/member/projectAttention/detail',
		data: params
	})
}
//获取项目关注列表
export function getProjectsAttention(params) {
	return request({
		method: 'POST',
		url: '/member/projectAttention/list',
		data: params
	})
}