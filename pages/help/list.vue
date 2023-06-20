<template>
	<view class="container">
		<view class="list">
			<view class="cont">
				<view class="li">
					<text class="price">什么是下单？</text>
					<text class="text">
						34324
					</text>
				</view>
				<view class="li">
					<text class="price">什么是公民？</text>
					<text class="text">
						34324
					</text>
				</view>
				<view class="li">
					<text class="price">什么是社长？</text>
					<text class="text">
						34324
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fetchContent,
		fetchRecommendProductList
	} from '@/api/home.js';

	export default {
		components: {},
		data() {
			return {
				info: {
					list: [],
					prms: {
						startTime: undefined,
						endTime: undefined,
						pageNum: 1,
						pageSize: 13
					},
					loadingType: 'more'
				}
			};
		},
		onLoad() {

		},
		//下拉刷新
		onPullDownRefresh() {

		},
		//加载更多
		onReachBottom() {

		},
		methods: {
			/** 加载数据 */
			async loadData() {
				const me = this,
					info = me.info;
				fetchRecommendProductList(info.prms).then(response => {
					info.list = response.data;
					uni.stopPullDownRefresh();
				})
			},
		},
	}
</script>

<style lang="scss">
	.container {
		width: 720upx;
		margin: 20upx auto;
		background: linear-gradient(rgba(255, 255, 255, .06) 20%, #fff 30%);
	}
	.list {
		display: flex;
		flex-wrap: wrap;

		.empty {
			padding: 50upx;
			text-align: center;
			font-size: 50upx;
		}

		.cont {
			padding: 0 20upx;
			display: flex;
			flex-wrap: wrap;
		}

		.li {
			width: 100%;
			line-height: 100upx;
			border-bottom: 1px solid #fafafa;
			display: flex;
			flex-direction: column;	
			justify-content: space-between;
		}

		.price {
			font-size: $font-lg;
			color: $font-color-dark;
		}

		.date {
			font-size: $font-base;
			color: $font-color-light;
		}
	}
</style>