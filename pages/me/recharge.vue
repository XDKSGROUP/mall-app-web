<template>
	<view class="content">
		<view class="recharge">
			<view class="row b-b">
				<view class="tit">申购金额</view>
				<input class="input" type="text" v-model="form.rechargeMoney" placeholder="输入金额"
					placeholder-class="placeholder" @input="o=>form.rechargeMoney=o.detail.value.replace(/[^\d]/g,'')" />
			</view>
			<view class="row b-b row2">
				<view class="tit">截图</view>
				<view class="link" @click="selectFile()">上传</view>
				<image :src="form.rechargePic"></image>
			</view>
			<button class="add-btn" @click="confirm">确定申购</button>
		</view>
		<view class="links">
			<view class="link" @click="gotoList()">查看申购记录</view>
		</view>
	</view>
</template>

<script>
	import {
		addRecharge
	} from '@/api/me.js';

	export default {
		data() {
			return {
				time: 0,
				form: {
					type: 0, //0爱心值1贡献值
					rechargeMoney: undefined,
					rechargePic: '',
				}
			}
		},
		onLoad(option) {

		},
		methods: {
			gotoList(){
				uni.navigateTo({url:'/pages/me/rechargelist'});
			},
			selectFile() {
				const me = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						me.form["rechargePic"] = res.tempFilePaths[0];
						console.log(JSON.stringify(res));
					}
				})
			},
			//提交
			confirm() {
				let me = this,
					data = me.form;
				if (!data.rechargeMoney) {
					me.$api.msg(`请输入金额`);
					return;
				}
				if (!data.rechargePic) {
					me.$api.msg(`请上传截图`);
					return;
				}
				addRecharge(data).then(res => {
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

<style scoped lang="scss">
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
	}

	.tit {
		flex-shrink: 0;
		width: 150upx;
		font-size: 30upx;
		color: $font-color-dark;
	}

	image {
		width: 180upx;
		height: 180upx;
		margin-left: 20upx;
	}

	.input {
		flex: 1;
		font-size: 30upx;
		color: $font-color-dark;
	}

	.link {
		color: royalblue;
	}

	.row2 {
		height: 200upx;
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

	.links {
		text-align: center;
	}
</style>