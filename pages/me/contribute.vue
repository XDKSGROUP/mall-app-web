<template>
	<view class="container">
		<view class="main">
			<view class="empty" v-if="info.list.length<=0">
				暂无信息
			</view>
			<view class="list" v-if="info.list.length>0">
				<view v-for="(item, index) in info.list" :key="index" class="li" @click="navToDetailPage(item)">
					<view class="img">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="info">
						<text class="title"
							:title="item.name">{{item.name.length>38?item.name.substring(0,38)+"...":item.name}}</text>
						<text class="date">20223-06-08</text>
						<text class="price">捐助￥{{item.price}}</text>
					</view>
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
						pageNum: 1,
						pageSize: 4
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
			/** 详情页 */
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/project/detail?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		width: 720upx;
		margin: 20upx auto 0;
		background: linear-gradient(rgba(255, 255, 255, .06) 20%, #fff 30%);
	}

	.empty {
		padding: 50upx;
		text-align: center;
		font-size: 50upx;
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 20upx;

		.li {
			width: 100%;
			padding-bottom: 40upx;
			border-bottom: 1px solid #fefefe;
			display: flex;
			flex-direction: row;
		}

		.img {
			width: 30%;
			height: 250upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.info {
			width: 70%;
			display: flex;
			flex-direction: column;
			padding-left: 40upx;
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 50upx;
		}

		.date {
			font-size: $font-sm;
			color: $font-color-light;
			line-height: 40upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
		}
	}
</style>