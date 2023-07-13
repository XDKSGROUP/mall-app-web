<template>
	<view class="container">
		<view class="article">
			<view class="title">{{info.title}}</view>
			<view class="prms">
				<view>{{info.sendTime}}</view>
			</view>
			<view class="content">
				<rich-text :nodes="info.contents"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getInfo
	} from '@/api/message.js';
	export default {
		data() {
			return {
				info: {
					title: "",
					intro: "",
					content: "",
					publishTime: "",
					pageview: 0
				}
			}
		},
		onLoad(params) {
			const me = this;
			me.loadData(params.id);
		},
		methods: {
			setTitle(title) {
				uni.setNavigationBarTitle({
					title: title
				});
			},
			async loadData(id) {
				const me = this;
				getInfo({
					id: id
				}).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					Object.assign(me.info, res.data);
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.article {
		width: 710upx;
		margin: 20upx auto;
		padding: 18upx 0;
		background-color: #fff;
		border-radius: 10upx;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.02);
	}

	.title {
		line-height: 60upx;
		padding: 10upx 20upx 30upx;
		font-size: 32upx;
		text-align: center;
		color: #303133;
		font-weight: 600;
		border-bottom: 1px solid #f5f5f5;
	}

	.prms {
		padding: 30upx;
		font-size: 26upx;
		text-align: center;
		color: #7d7d7d;
		display: flex;
		justify-content: center;
	}

	.content {
		margin: 20upx 24upx 40upx;
	}
</style>