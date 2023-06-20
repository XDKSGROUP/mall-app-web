<template>
	<view class="container">
		<view class="fixtop">
			<!-- 搜索 -->
			<view class="search">
				<input class="input" type="text" v-model="form.name" placeholder="输入项目名称" @confirm="loadData()" />
			</view>

			<!-- 主菜单 -->
			<movable-area class="menu">
				<movable-view direction="all" :inertia="true" damping="1" friction="0.2" class="init"
					:style="{width:getMenuWidth()+'px'}">
					<view class="cont">
						<view class="li" v-for="(it,key) of menus" :key="key" :class="menusIndex.s1===key?'s':''"
							@click="changeMenu(key,0)">
							<image :src="it.img"></image>
							<text>{{it.name}}</text>
						</view>
					</view>
				</movable-view>
			</movable-area>
		</view>
		<!-- 子菜单 -->
		<!-- <view class="commend">
				<view class="li" v-for="(it,key) of menusIndex.lst2" :key="key" :class="menusIndex.s2===key?'s':''"
					@click="changeMenu(menusIndex.s1,key)">
					<text>{{it.name}}</text>
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
		getListClass,
		getList,
	} from '@/api/project.js';
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
				menusIndex: { //选中主菜单
					s1: 0,
					s2: 0,
					lst2: []
				},
				menus: [], //主菜单
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
		onLoad(options) {
			if(options.id)this.menusIndex.s1=parseInt(options.id);
			this.loadMenus();
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
			loadMenus() {
				const me = this;
				getListClass({}).then(res => {
					if (!res.data || !res.data.length) {
						return;
					}
					const its = res.data.map(it => {
						return {
							id: it.id,
							img: "/static/project/mu" + it.id + ".png",
							name: it.name,
							lst: [{
								name: "精选项目"
							}, {
								name: "最近项目"
							}]
						};
					});
					its.splice(its.length - 1, 1);
					me.menus.push(...its);
					me.changeMenu(me.menusIndex.s1, 0);
				});
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
				getList(me.form).then(res => {
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
		padding: 20upx 0 0;
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

	.menu {
		width: 100%;
		height: 188upx;
		margin-bottom: -1upx;
		overflow: hidden;

		>.init {
			height: 100%;
		}

		/* 分类 */
		.cont {
			height: 100%;
			border-bottom: 1upx #eee solid;
			background-color: #f6f6f5;
			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;

			.li {
				width: 188upx;
				height: 188upx;
				padding: 20px 0 0;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: $font-sm + 2upx;
				color: $font-color-dark;
			}

			.li.s {
				background-image: linear-gradient(rgba(255, 255, 255, 0.06) 20%, #fff 90%);
				z-index: 10;
				position: relative;
			}

			/* 原图标颜色太深,不想改图了,所以加了透明度 */
			image {
				width: 88upx;
				height: 88upx;
				border-radius: 50%;
				opacity: .7;
				box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
			}

			text {
				height: 60upx;
				line-height: 60upx;
			}
		}

		.commend {
			padding: 0 20px 20px;
			font-size: 26upx;
			background-color: #fff;
			display: flex;

			.li {
				margin-right: 20upx;
				padding: 10upx 30upx;
				border: 1upx solid #ccc;
				border-radius: 40upx;
			}

			.li:last-child {
				margin-right: 0upx;
			}

			.s {
				color: #ee0000;
				border: 1upx #ee0000 solid;
			}
		}
	}

	.list {
		padding: 298upx 30upx 120upx;
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