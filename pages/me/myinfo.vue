<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">随机编号:</text>
			<view>{{userInfo.teamNumber}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">团队编号:</text>
			<view>{{userInfo.commonTeamNumber}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">用户帐号:</text>
			<view>{{userInfo.username}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">推荐账号:</text>
			<view>{{userInfo.inviterUsername}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">注册时间:</text>
			<view>{{userInfo.createTime}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">退休时间:</text>
			<view>{{userInfo.retireTime?userInfo.retireTime:"未退休"}}</view>
		</view>

		<button class="add-btn" @click="back()">返回</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		rtnDateToStr
	} from '@/utils/com.js';

	export default {
		data() {
			return {}
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad(option) {
			console.log(this.userInfo)
		},
		onReady() {

		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			back() {
				uni.switchTab({
					url: "/pages/me/info",
					fail(err) {
						console.log(err)
					}
				})
			}
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