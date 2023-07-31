<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">原密码</text>
			<input class="input" type="password" v-model="form.oldPassword" placeholder="输入原密码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">新密码</text>
			<input class="input" type="password" v-model="form.password" placeholder="输入新密码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">确认密码</text>
			<input class="input" type="password" v-model="form.password2" placeholder="再次输入新密码"
				placeholder-class="placeholder" />
		</view>

		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import {
		message
	} from '@/utils/message.js';
	import {
		setLoginPassword2
	} from '@/api/me.js';

	export default {
		data() {
			return {
				form: {
					oldPassword: '',
					password: '',
					password2: ''
				}
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad(option) {
			let title = '登录密码';
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			//提交
			confirm() {
				let data = this.form;
				if (data.password != data.password2) {
					message('两次密码不一致');
					return;
				}
				setLoginPassword2(data).then(res => {
					if (res.code != 200) {
						message(res.message);
						return;
					}
					message('修改成功');
					setTimeout(() => {
						uni.navigateTo({
							url:"/pages/me/set"
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