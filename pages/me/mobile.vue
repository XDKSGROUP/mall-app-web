<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="form.telephone" placeholder="输入手机号"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">登录密码</text>
			<input class="input" type="password" v-model="form.password" placeholder="输入登录密码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">验证码</text>
			<input class="input" type="number" v-model="form.authCode" placeholder="输入验证码"
				placeholder-class="placeholder" />
			<view class="link" @click="sendVerifyCode" v-if="time<=0">发送</view>
			<view class="link" v-if="time>0">剩余{{time}}秒</view>
		</view>

		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import {
		getVerifyCode,
		setMobile
	} from '@/api/me.js';

	export default {
		data() {
			return {
				time: 0,
				form: {
					password: '',
					telephone: '',
					authCode: ''
				}
			}
		},
		onLoad(option) {

		},
		methods: {
			async sendVerifyCode(e) {
				const me = this;
				const res = await getVerifyCode(me.form);
				if (res.code != 200) {
					me.$api.msg(res.message);
					return;
				}
				me.time = 60;
				me.tid = setInterval(function() {
					if (me.time <= 0) clearInterval(me.tid);
					me.time--;
				}, 1000);
			},
			//提交
			confirm() {
				let me=this,data = this.form;
				if (!data.telephone || !/^\d{11}$/.test(data.telephone)) {
					me.$api.msg(`请输入正确的手机号`);
					return;
				}
				if (!data.password) {
					me.$api.msg(`请输入登录密码`);
					return;
				}
				setMobile(data).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg(`修改成功`);
					setTimeout(() => {
						uni.navigateTo({
							url: "/pages/me/set"
						})
					}, 1500)
				});
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