<template>
	<view class="container">
		<!-- <view class="fixtop">
			<view class="search">
				<input class="input" type="text" v-model="form.name" placeholder="输入项目名称" @confirm="loadData()" />
			</view>
		</view> -->

		<view class="list">
			<view v-for="(item, index) in list" :key="index" class="li" @click="gotoDetail(item)">
				<view class="img">
					<image :src="item.pic.replace(/^\s+/,'')" mode="aspectFill"></image>
				</view>
				<view class="txt">
					<text class="title clamp">{{item.name}}</text>
					<text class="title2">{{item.info}}</text>
					<text class="price">￥{{item.raisedMoney}}/{{item.targetMoney}}</text>
				</view>
			</view>
			<view class="tc">
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getProjectsAttention,
	} from '@/api/me.js';
	import {
		formatDate
	} from '@/utils/date';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		components: {
			uniLoadMore,
		},
		data() {
			return {
				list: [], //列表数据
				form: { //查询参数
					categoryId: undefined,
					name: undefined,
					pageNum: 1,
					pageSize: 5
				},
				loadingType: 'more'
			};
		},
		onLoad() {
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData();
			uni.stopPullDownRefresh();
		},
		//加载更多
		onReachBottom() {
			this.loadData(1);
		},
		methods: {
			getMenuWidth() {
				return uni.upx2px(this.menus.length * 188);
			},
			changeMenu(s1, s2) {
				const me = this;
				me.menusIndex.s1 = s1;
				me.menusIndex.s2 = s2;
				me.menusIndex.lst2.splice(0, me.menusIndex.lst2.length);
				const mainMenu = me.menus[s1];
				me.form.categoryId = mainMenu.id;
				me.menusIndex.lst2.push(...me.menus[s1].lst);
				me.loadData();
			},
			/**
			 * 加载数据
			 */
			loadData(isAppend) {
				const me = this;
				if (isAppend) {
					me.form.pageNum++;
				} else {
					me.form.pageNum = 1;
				}
				getProjectsAttention(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					const list = res.data.list;
					me.loadingType = list.length < me.form.pageSize ? 'nomore' : 'more';
					if (isAppend) {
						if (list.length == 0) {
							return;
						}
					} else {
						me.list.splice(0, me.list.length);
					}
					//加入列表
					me.list.push(...list);
				});
			},
			//详情页
			gotoDetail(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/project/detail?id=${id}`
				})
			},
			//跳转到列表页
			gotoList() {
				uni.navigateTo({
					url: `/pages/project/list`
				})
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.container {
		margin: 0 0 120upx;
		background: linear-gradient(rgba(255, 255, 255, .06) 20%, #fff 30%);
		position: relative;
	}

	.fixtop {
		width: 100%;
		padding: 20upx 0;
		background: #f5f5f5;
		z-index: 5;
		position: fixed;
	}

	.search {
		width: 100%;
		padding: 0 80upx;


		.input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}

	.list {
		// padding: 130upx 30upx 120upx;
		padding: 30upx 30upx 120upx;
		background: #fff;
		display: flex;
		flex-wrap: wrap;

		.li {
			display: flex;
			flex-direction: row;
			width: 100%;
			padding-top: 40upx;
		}

		.li:first-child {
			padding-top: 0upx;
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

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.title2 {
			font-size: $font-sm;
			color: $font-color-light;
			line-height: 40upx;
			height: 80upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 80upx;
		}

		.txt {
			width: 70%;
			display: flex;
			flex-direction: column;
			padding-left: 40upx;
		}

		.tc {
			width: 100%;
			line-height: 90upx;
			justify-content: center;

		}
	}
</style>