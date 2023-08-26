<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">银行名称</text>
			<input class="input" type="text" v-model="form.bankName" placeholder="输入银行名称"
				placeholder-class="placeholder" @="toInput" />
		</view>
		<view class="row b-b">
			<text class="tit">支行名称</text>
			<input class="input" type="text" v-model="form.branchName" placeholder="输入支行名称"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">持卡人</text>
			<input class="input" type="text" v-model="form.cardholder" @input="changeName('cardholder',arguments)" placeholder="输入持卡人"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">银行卡号</text>
			<input class="input" type="number" v-model="form.bankCardNumber" @input="changeCard('bankCardNumber',arguments)" placeholder="输入银行卡号"
				placeholder-class="placeholder" />
		</view>

		<!-- <view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="form.defaultStatus==1" color="#fa436a" @change="switchChange" />
		</view> -->
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import {
		message
	} from '@/utils/message.js';
	import {
		getBankCard,
		setBankCard,
		addBankCard,
	} from '@/api/me.js';

	export default {
		data() {
			return {
				form: {
					id: 0,
					bankName: '',
					bankCardNumber: '',
					postCode: '',
					branchName: '',
					default: false,
				}
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad(option) {
			const me = this;
			let title = '新增银行卡';
			if (option.type === 'edit') {
				title = '编辑银行卡'
				getBankCard(option).then(res => {
					this.form = res.data;
				});
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			changeName(name,args) {
				const me=this;
				const newValue = args[0].target.value;
				me.$nextTick(()=>{
					me.form[name]=newValue.replace(/[^\u4E00-\u9FA5]/g,"");
				});
			},
			changeCard(name,args) {
				const me=this;
				const newValue = args[0].target.value;
				me.$nextTick(()=>{
					me.form[name]=newValue.replace(/[^\d]/g,"");
				});
			},
			switchChange(e) {
				this.form.defaultStatus = e.detail.value ? 1 : 0;
			},
			//提交
			confirm() {
				let data = this.form;
				if (this.manageType == 'edit') {
					setBankCard(this.form).then(res => {
						if (res.code != 200) {
							message(res.message);
							return;
						}
						message('修改成功');
					});
				} else {
					addBankCard(this.form).then(res => {
						if (res.code != 200) {
							message(res.message);
							return;
						}
						message('添加成功');
					});
				}
				setTimeout(() => {
					uni.switchTab({
						url: "/pages/me/info"
					})
				}, 2000)
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>