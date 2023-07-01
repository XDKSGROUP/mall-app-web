<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">银行名称</text>
			<input class="input" type="text" v-model="form.bankName" placeholder="输入银行名称"
				placeholder-class="placeholder" @input="toInput" />
		</view>
		<view class="row b-b">
			<text class="tit">支行名称</text>
			<input class="input" type="text" v-model="form.branchName" placeholder="输入支行名称"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">持卡人</text>
			<input class="input" type="text" v-model="form.cardholder" placeholder="输入持卡人"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">银行卡号</text>
			<input class="input" type="number" v-model="form.bankCardNumber" placeholder="输入银行卡号"
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
			toInput() { //arguments
				return false;
				const value = arguments[0].target.value;
				if (/^[^\d]+$/.test(value)) return false;
			},
			switchChange(e) {
				this.form.defaultStatus = e.detail.value ? 1 : 0;
			},
			//提交
			confirm() {
				debugger
				let data = this.form;
				if (this.manageType == 'edit') {
					setBankCard(this.form).then(res => {
						if (res.code != 200) {
							uni.showToast({
								title: res.message,
								duration: 1000
							});
							return;
						}
						uni.showToast({
							title: '修改成功',
							icon: 'none',
							mask: true,
							duration: 1000
						});
					});
				} else {
					addBankCard(this.form).then(res => {
						if (res.code != 200) {
							uni.showToast({
								title: res.message,
								duration: 1000
							});
							return;
						}
						uni.showToast({
							title: '添加成功',
							icon: 'none',
							mask: true,
							duration: 1000
						});
					});
				}
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/me/bankcard"
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