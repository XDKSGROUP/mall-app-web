<template>
	<view class="container">
		<view class="doc">
			<view class="title" v-if="false">联系客服</view>
			<view class="cont">
				<text class="tt">
					客服QQ
				</text>
				<text>
					65464564654
				</text>
				<text>
					65464564654
				</text>
				<text>
					65464564654
				</text>
				<text class="tt">
					客服电话
				</text>
				<text>
					13788888888
				</text>
				<text>
					13788888888
				</text>
				<text>
					13788888888
				</text>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		fetchContent,
	} from '@/api/home.js';
	import {
		formatDate
	} from '@/utils/date';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
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

			},
		},
	}
</script>

<style scoped lang="scss">
	.container {
		width: 720upx;
		margin: 20upx auto;
		background: linear-gradient(rgba(255, 255, 255, .06) 20%, #fff 30%);
	}

	.doc {
		width: 750upx;
		line-height: 50upx;
		margin-left: -15upx;
		background: #fff;
		position: relative;

		.title {
			padding: 20upx;
			font-size: 36upx;
			border-bottom: 1px solid #ddd;
			align-items: center;
			flex-wrap: wrap;
			display: flex;
		}

		.cont {
			width: 710upx;
			margin: 0 auto;
			padding: 20upx 0;
			font-size: 30upx;
		}

		.tt {
			color: #333;
			text-indent: 0em;
		}
	}

	text {
		padding: 10upx 0;
		text-indent: 2em;
		color: #666;
		display: block;
	}

	span {
		text-indent: 2em;
	}
</style>