<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">登录密码</text>
			<input class="input" type="password" v-model="form.password" placeholder="输入登录密码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="form.mobile" placeholder="输入手机号"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">验证码</text>
			<input class="input" type="number" v-model="form.verifyCode" placeholder="输入验证码"
				placeholder-class="placeholder" />
			<view class="link" @click="sendVerifyCode" v-if="time<=0">发送</view>
			<view class="link" v-if="time>0">剩余{{time}}秒</view>
		</view>

		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import {
		addAddress,
		updateAddress,
		fetchAddressDetail
	} from '@/api/address.js';

	export default {
		data() {
			return {
				time: 0,
				form: {
					password: '',
					mobile: '',
					verifyCode: ''
				}
			}
		},
		onLoad(option) {
			let title = '更改手机号';
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			sendVerifyCode(e) {
				const me = this;
				me.time=60;
				me.tid = setInterval(function() {
					if (me.time<=0) clearInterval(me.tid);
					me.time--;
				}, 1000);
			},
			//提交
			confirm() {
				let data = this.addressData;
				if (!data.name) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phoneNumber)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (!data.province) {
					this.$api.msg('请在地图选择所在位置');
					return;
				}
				if (!data.detailAddress) {
					this.$api.msg('请填写详细地址信息');
					return;
				}
				if (this.manageType == 'edit') {
					updateAddress(this.addressData).then(response => {
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
						this.$api.prePage().refreshList(data, this.manageType);
						this.$api.msg("地址修改成功！");
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					});
				} else {
					addAddress(this.addressData).then(response => {
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
						this.$api.prePage().refreshList(data, this.manageType);
						this.$api.msg("地址添加成功！");
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					});
				}
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

	.link {
		color: royalblue;
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