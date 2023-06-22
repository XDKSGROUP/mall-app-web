<template>
	<view class="container">
		<view class="change">
			<view class="l">变动金额</view>
			<view class="r">+78,657.67</view>
		</view>
		<view class="list">
			<view class="li">
				<view class="l">交易时间</view>
				<view class="r">2023-06-11 07:45:35</view>
			</view>
			<view class="li">
				<view class="l">对方账号</view>
				<view class="r">8373782983487823949384</view>
			</view>
			<view class="li">
				<view class="l">交易类型</view>
				<view class="r">转入</view>
			</view>
			<view class="li">
				<view class="l">本次金额</view>
				<view class="r">898,687.47</view>
			</view>
			<view class="li2">
				<view class="l">备注：</view>
				<view class="r">
					让你火箭般的速度下载docker镜像! 的冷漠度 百家号17-11-1713:09 因为有墙的原因所以在国内下载docker镜像的速度非常慢,有时候是几kb每秒,那个蛋疼的等待,真是谁等谁知道!让你火箭般的速度下载docker镜像! 的冷漠度 百家号17-11-1713:09 因为有墙的原因所以在国内下载docker镜像的速度非常慢,有时候是几kb每秒,那个蛋疼的等待,真是谁等谁知道!让你火箭般的速度下载docker镜像! 的冷漠度 百家号17-11-1713:09 因为有墙的原因所以在国内下载docker镜像的速度非常慢,有时候是几kb每秒,那个蛋疼的等待,真是谁等谁知道!让你火箭般的速度下载docker镜像! 的冷漠度 百家号17-11-1713:09 因为有墙的原因所以在国内下载docker镜像的速度非常慢,有时候是几kb每秒,那个蛋疼的等待,真是谁等谁知道!
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad(option) {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.container {
		font-size: 23upx;
		background-color: #f5f5f5;

		.change {
			width: 750upx;
			height: 100upx;
			line-height: 100upx;
			padding: 0 25upx;
			background-color: #fff;
			display: flex;
			justify-content: space-between;

			.l {
				color: #333;
			}

			.r {
				font-size: 36upx;
				color: #f15d6b
			}
		}

		.list {
			width: 750upx;
			margin: 16upx 0 0;
			padding: 25upx;
			background-color: #fff;

			.li {
				line-height: 38upx;
				color: #333;
				display: flex;
				justify-content: space-between;

				.l {
					
				}

				.r {
					
				}
			}
			
			.li2 {
					line-height: 38upx;
					color: #333;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
			
					.l {
						
					}
			
					.r {
						margin:10upx 0 0;
						padding:20upx;
						background-color:#f5f5f5 ;
					}
				}
			
		}
	}
</style>