<template>
	<view class="content">
		<view class="label">请输入退款密码</view>
		<input v-model="params.pwd" placeholder="退款密码" :password="openPassword" />
		<view :class="[!openPassword ? 'psd-eye-active' : 'psd-eye']" @click="changePassword"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openPassword: true
			}
		},
		methods: {
			changePassword() {
				this.openPassword = !this.openPassword;
			}
		},
	}
</script>

<style lang="scss">
	.content {
		position: relative;

		.psd-eye-active {
			width: 45rpx;
			height: 45rpx;
			background: url(../../../static/login/icon_turn.png) no-repeat center center;
			position: absolute;
			right: 50rpx;
			top: 50%;
			z-index: 10;
		}

		.psd-eye {
			width: 45rpx;
			height: 45rpx;
			background: url(../../../static/login/eye.png) no-repeat center center;
			position: absolute;
			right: 50rpx;
			top: 50%;
			z-index: 10;
		}
	}
</style>