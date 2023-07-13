<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="gotoLogin"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">测试注册</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号</text>
					<input type="text" v-model="form.telephone" placeholder="请输入用户名" maxlength="11" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="text" v-model="form.password" placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty" maxlength="20" password />
				</view>
				<view class="input-item">
					<text class="tit">邀请人</text>
					<input type="text" v-model="form.inviterTelephone" placeholder="请输入邀请人" maxlength="11" />
				</view>
			</view>
			<button class="confirm-btn" @click="register" :disabled="logining">注册并登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import {
		getVerifyCode
	} from '@/api/me.js';
	import {
		addMember2,
		memberInfo,
		memberLogin,
	} from '@/api/member.js';
	export default {
		data() {
			return {
				time: 0,
				logining: false,
				form: {
					telephone: '',
					password: '888888',
					inviterTelephone: "",
					pointTelephone: ''
				}
			}
		},
		onLoad(options) {
			const me = this;
			me.form.inviterTelephone = options.inviterTelephone;
			me.form.pointTelephone = options.inviterTelephone;
			me.form.username = uni.getStorageSync('username') || '';
			me.form.password = uni.getStorageSync('password') || '';
		},
		methods: {
			...mapMutations(['login']),
			gotoLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			gotoHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
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
			async register() {
				const me = this;
				me.logining = true;
				me.form.pointTelephone=me.form.inviterTelephone;
				addMember2(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg(`注册成功`);
					me.loginIn();
				}).catch((err) => {
					me.logining = false;
				});
			},
			async loginIn() {
				const me = this;
				memberLogin({
					username: me.form.telephone,
					password: me.form.password
				}).then(response => {
					let token = response.data.tokenHead + response.data.token;
					uni.setStorageSync('token', token);
					uni.setStorageSync('username', me.form.telephone);
					uni.setStorageSync('password', me.form.password);
					memberInfo().then(response => {
						me.login(response.data);
						me.gotoHome();
					});
				}).catch(() => {
					me.logining = false;
				});
			},
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.line {
		width: 100%;
		display: flex;
		justify-content: space-between;
		white-space: nowrap;
	}
</style>