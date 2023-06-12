<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">昵称</text>
			<input class="input" type="text" v-model="form.name" placeholder="输入昵称" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">性别</text>
			<picker :value="form.sex" @change="setSex" :range="sexs">
				<input class="input" type="text" v-model="form.sex" placeholder="选择性别" placeholder-class="placeholder"  readyonly="readyonly" />
			</picker>
			
		</view>
		<view class="row b-b">
			<text class="tit">生日</text>
			<picker mode="date" :value="form.birthday" :start="'1900-01-01'" :end="'2100-01-01'" @change="setBirthday">
				<input class="input" type="text" v-model="form.birthday" placeholder="选择生日" readyonly="readyonly"
					placeholder-class="placeholder" />
			</picker>
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
				sexs:['男','女'],
				form: {
					name: '',
					sex: '',
					birthday: ''
				}
			}
		},
		onLoad(option) {
			let title = '修改资料';
			// fetchAddressDetail(option.id).then(response => {
			// 	this.addressData = response.data;
			// });
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			setBirthday(e){
				this.form.birthday=e.detail.value;
			},
			setSex(e){
				this.form.sex=this.sexs[e.detail.value];
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