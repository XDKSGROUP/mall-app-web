<template>
	<view class="container">
		<view class="info mt_20">
			<view class="li">
				<view class="label">剩余爱心值</view>
				<view class="input">
					1500颗
				</view>
			</view>
		</view>
		<view class="search">
			<view class="li">
				<view class="label">起始时间：</view>
				<view class="input">
					<picker mode="date" :value="info.prms.startTime" :start="'1900-01-01'" :end="info.prms.endTime"
						@change="setStartTime">
						<input class="input" type="text" v-model="info.prms.startTime" placeholder="请选择起始时间"
							readyonly="readyonly" />
					</picker>
				</view>
			</view>
			<view class="li">
				<view class="label">结束时间：</view>
				<view class="input">
					<picker mode="date" :value="info.prms.endTime" :start="info.prms.startTime" :end="'2100-01-01'"
						@change="setEndTime">
						<input class="input" type="text" v-model="info.prms.endTime" placeholder="请选择结束时间"
							readyonly="readyonly" />
					</picker>
				</view>
			</view>
		</view>
		<view class="list" v-if="info.list.length>0">
			<view class="empty" v-if="info.list.length<=0">
				暂无信息
			</view>
			<view class="cont">
				<view v-for="(item, index) in info.list" :key="index" class="li" @click="navToDetailPage(item)">
					<text class="price">购买：{{item.price}} 颗</text>
					<text
						class="date">{{item.promotionStartTime?item.promotionStartTime.replace(/T(\d+\:\d+\:\d+).*$/," $1"):"暂无时间"}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="info.loadingType"></uni-load-more>
	</view>
</template>

<script>
	import {
		fetchContent,
		fetchRecommendProductList
	} from '@/api/home.js';
	import {
		formatDate
	} from '@/utils/date';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		components: {
			uniLoadMore
		},
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
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.info.prms.pageNum = 1;
			this.loadData();
		},
		//加载更多
		onReachBottom() {
			this.nextData();
		},
		computed: {

		},
		filters: {

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
			/** 加载下一页 */
			async nextData() {
				const me = this,
					info = me.info;
				info.prms.pageNum++;
				info.loadingType = 'loading';
				fetchRecommendProductList(info.prms).then(response => {
					let newlist = response.data;
					if (response.data.length === 0) {
						//没有更多了
						info.prms.pageNum--;
						info.loadingType = 'nomore';
					} else {
						info.list = info.list.concat(newlist);
						info.loadingType = 'more';
					}
				})
			},
			/** 设置起始时间 */
			async setStartTime(e) {
				this.info.prms.startTime = e.detail.value;
			},
			/** 设置结束时间 */
			async setEndTime(e) {
				this.info.prms.endTime = e.detail.value;
			}
		},
	}
</script>

<style lang="scss">
	.container {
		width: 720upx;
		margin: 20upx auto;
		background: linear-gradient(rgba(255, 255, 255, .06) 20%, #fff 30%);
	}

	.mt20 {
		margin-top: 20upx;
	}

	.mt_20 {
		margin-top: -20upx;
	}

	.info {
		width: 750upx;
		line-height: 50upx;
		margin-left: -15upx;
		background: #fff;
		position: relative;

		.li {
			padding: 20upx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-bottom: 1px solid #ddd;
		}

		.label {
			width: 30%;
			padding: 0 20upx;
			font-size: 30upx;
			color: $font-color-dark;
			flex-shrink: 0;
		}

		.input {
			width: 65%;
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.search {
		width: 750upx;
		line-height: 50upx;
		margin-left: -15upx;
		background: linear-gradient(0deg, #eee, transparent);
		box-shadow: 0upx 0upx 15upx #ddd;

		.li {
			padding: 20upx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-bottom: 1px solid #ddd;
		}

		.label {
			width: 30%;
			padding: 0 20upx;
			font-size: 30upx;
			color: $font-color-dark;
			flex-shrink: 0;
		}

		.input {
			width: 65%;
			font-size: 30upx;
			color: $font-color-dark;
		}
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
			flex-direction: row;
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