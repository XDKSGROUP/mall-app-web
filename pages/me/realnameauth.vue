<template>
	<view class="content">
		<view class="info" v-if="form.realNameStatus===2">
			申请已驳回，原因：{{form.certificationRejectReason}}
		</view>
		<view class="success" v-if="form.realNameStatus===3">
			通过审核
		</view>
		<view class="row b-b">
			<text class="tit">真实姓名</text>
			<input class="input" type="text" v-model="form.realName" placeholder="输入真实姓名"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">身份证号码</text>
			<input class="input" type="text" v-model="form.identificationNumber" placeholder="输入身份证号码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b row2">
			<text class="tit">身份证正面</text>
			<view class="link" @click="selectFile(1)" v-if="form.realNameStatus!==1&&form.realNameStatus!==3">上传照片
			</view>
			<image :src="form.idCardFront"></image>
		</view>
		<view class="row b-b row2">
			<text class="tit">身份证反面</text>
			<view class="link" @click="selectFile(2)" v-if="form.realNameStatus!==1&&form.realNameStatus!==3">上传照片
			</view>
			<image :src="form.idCardBack"></image>
		</view>

		<button class="add-btn" v-if="form.realNameStatus!==3"
			@click="confirm">{{form.realNameStatus===1?"审核中":"提交"}}</button>
	</view>
</template>

<script>
	import {
		uploadFile
	} from "@/api/file.js"
	import {
		getMeInfo,
		setRealnameAuth
	} from '@/api/me.js';

	export default {
		data() {
			return {
				form: {
					realName: '',
					identificationNumber: '',
					idCardFront: '',
					idCardBack: '',
					realNameStatus: 0,
				}
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		async onLoad(option) {
			const me = this;
			let title = '实名认证';
			uni.setNavigationBarTitle({
				title
			});
			const rst = await getMeInfo();
			if (rst.data) {
				Object.assign(me.form, rst.data);
			}
		},
		methods: {
			async selectFile(num) {
				const me = this;
				const res = await uploadFile();
				if (!res.success) {
					me.$api.msg(res.message);
					return;
				}
				console.log(res.data)
				me.form["idCard" + (num == 1 ? "Front" : "Back")] = res.data;
			},
			//提交
			confirm() {
				const me = this,
					form = me.form;
				if (form.realNameStatus === 1) {
					me.$api.msg('正在审核中...无法提交');
					return;
				}
				if (!form.realName) {
					me.$api.msg('请填写真实姓名');
					return;
				}
				if (!form.identificationNumber) {
					me.$api.msg('请填写身份证号码');
					return;
				}
				if (!form.idCardFront) {
					me.$api.msg('请上传身份证正面照片');
					return;
				}
				if (!form.idCardBack) {
					me.$api.msg('请上传身份证反面照片');
					return;
				}
				setRealnameAuth(form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg('提交成功');
					setTimeout(() => {
						uni.switchTab({
							url: "/pages/me/info"
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
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.link {
			color: royalblue;
		}

		image {
			width: 180upx;
			height: 180upx;
			margin-left: 20upx;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.row2 {
		height: 200upx;
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

	.info {
		padding: 30upx 30upx;
		margin-bottom: 15upx;
		color: #cc0000;
		background: #fff;
	}

	.success {
		padding: 30upx 30upx;
		margin-bottom: 15upx;
		text-align: center;
		color: green;
		background: #fff;
	}
</style>