<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">真实姓名</text>
			<input class="input" type="text" v-model="form.realName" placeholder="输入真实姓名"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">身份证号码</text>
			<input class="input" type="text" v-model="form.idCard" placeholder="输入身份证号码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b row2">
			<text class="tit">身份证正面</text>
			<view class="link" @click="selectFile(1)">上传照片</view>
			<image :src="form.idCardPhoto1"></image>
		</view>
		<view class="row b-b row2">
			<text class="tit">身份证反面</text>
			<view class="link" @click="selectFile(2)">上传照片</view>
			<image :src="form.idCardPhoto2"></image>
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
				form: {
					realName: '',
					idCard: '',
					idCardPhoto1: '',
					idCardPhoto2: '',
				}
			}
		},
		onLoad(option) {
			let title = '实名认证';
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			selectFile(num) {
				const me=this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						me.form["idCardPhoto"+num]=res.tempFilePaths[0];
						console.log(JSON.stringify(res));
					}
				})
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
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		
		.link{
			color:royalblue;
		}
		
		image{
			width:180upx;
			height:180upx;
			margin-left:20upx;	
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}
		
	.row2{
		height:200upx;
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