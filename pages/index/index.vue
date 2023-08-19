<template>
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled />
		</view>
		<!-- #endif -->

		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in advertiseList" :key="index" class="carousel-item"
					@click="goto(item.url)">
					<image :src="item.pic" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<view class="main">
			<!-- 菜单 -->
			<view class="menu">
				<view class="li s" @click="goto('/pages/product/list?sid=59')">
					<image src="/static/index/mu1.png"></image>
					<text>爱心</text>
				</view>
				<view class="li" @click="goto('/pages/product/list?sid=60')">
					<image src="/static/index/mu2.png"></image>
					<text>公益</text>
				</view>
				<view class="li" @click="goto('/pages/product/list?sid=61')">
					<image src="/static/index/mu3.png"></image>
					<text>慈善</text>
				</view>
				<view class="li" @click="gotos('/pages/project/index?id=2')">
					<image src="/static/index/mu4.png"></image>
					<text>日捐</text>
				</view>
			</view>

			<!-- 消息公告 -->
			<view class="notice">
				<view class="icon"></view>
				<view class="cont">
					<swiper class="inbox" :vertical="true" :indicator-dots="false" :autoplay="true" :interval="5000"
						:duration="500" v-if="showNotice">
						<swiper-item v-for="(it,at) in listNotice" :key="at">
							<view class="li">{{it.title}}</view>
						</swiper-item>
					</swiper>

				</view>
			</view>

			<!-- 爱心 -->
			<view class="product">
				<view class="title mt" @click="goto('/pages/product/list?sid=59')">
					<image src="/static/index/tt2.png"></image>
					<view class="cont">
						<text class="tit">爱心</text>
						<text class="tit2">爱心值专区</text>
					</view>
				</view>

				<view class="cont">
					<view v-for="(item, index) in listLove" :key="index" class="li" @click="navToDetailPage(item)">
						<view class="image-wrapper">
							<image :src="item.pic" mode="aspectFill"></image>
						</view>
						<view class="txt">
							<text class="tt clamp">{{item.name}}</text>
							<text class="tt2">{{item.subTitle}}</text>
							<text class="price">￥{{item.price}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 公益 -->
			<view class="product">
				<view class="title mt" @click="goto('/pages/product/list?sid=60')">
					<image src="/static/index/tt3.png"></image>
					<view class="cont">
						<text class="tit">公益</text>
						<text class="tit2">5折爱心值或贡献值专区</text>
					</view>
				</view>

				<view class="cont">
					<view v-for="(item, index) in listContribute5" :key="index" class="li"
						@click="navToDetailPage(item)">
						<view class="image-wrapper">
							<image :src="item.pic" mode="aspectFill"></image>
						</view>
						<view class="txt">
							<text class="tt clamp">{{item.name}}</text>
							<text class="tt2">{{item.subTitle}}</text>
							<text class="price">￥{{item.price}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 慈善 -->
			<view class="product">
				<view class="title mt" @click="goto('/pages/product/list?sid=61')">
					<image src="/static/index/tt4.png"></image>
					<view class="cont">
						<text class="tit">慈善</text>
						<text class="tit2">2.5折爱心值或贡献值专区</text>
					</view>
				</view>

				<view class="cont">
					<view v-for="(item, index) in listContribute2_5" :key="index" class="li"
						@click="navToDetailPage(item)">
						<view class="image-wrapper">
							<image :src="item.pic" mode="aspectFill"></image>
						</view>
						<view class="txt">
							<text class="tt clamp">{{item.name}}</text>
							<text class="tt2">{{item.subTitle}}</text>
							<text class="price">￥{{item.price}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<UpdateVersion :auto="true"></UpdateVersion>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		fetchContent,
		fetchRecommendProductList
	} from '@/api/home.js';
	import {
		baseUrl
	} from '@/utils/config.js';
	import {
		formatDate
	} from '@/utils/date';
	import {
		setTitleNViewStyle
	} from '@/utils/extUni.js';
	import {
		getUnRead,
		getList as getListNotice
	} from '@/api/notice.js';
	import UpdateVersion from '@/components/l/UpdateVersion.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		components: {
			UpdateVersion,
			uniLoadMore
		},
		data() {
			return {
				advertiseList:[],
				titleNViewBackground: '',
				titleNViewBackgroundList: [],
				swiperCurrent: 0,
				swiperLength: 0,
				showNotice: false,
				listNotice: [], //通知
				listLove: [], //爱心专区列表
				listContribute5: [], //5折贡献专区列表
				listContribute2_5: [], //2.5折贡献专区列表
			};
		},
		onLoad() {
			this.loadData();
		},
		onShow() {
			this.loadNotices();
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		//加载更多
		onReachBottom() {

		},
		computed: {
			cutDownTime() {
				let endTime = new Date(this.homeFlashPromotion.endTime);
				let endDateTime = new Date();
				let startDateTime = new Date();
				endDateTime.setHours(endTime.getHours());
				endDateTime.setMinutes(endTime.getMinutes());
				endDateTime.setSeconds(endTime.getSeconds());
				let offsetTime = (endDateTime.getTime() - startDateTime.getTime());
				let endHour = Math.floor(offsetTime / (60 * 60 * 1000));
				let offsetMinute = offsetTime % (60 * 60 * 1000);
				let endMinute = Math.floor(offsetMinute / (60 * 1000));
				let offsetSecond = offsetTime % (60 * 1000);
				let endSecond = Math.floor(offsetSecond / 1000);
				return {
					endHour: endHour,
					endMinute: endMinute,
					endSecond: endSecond
				}
			}
		},
		filters: {
			formatTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'hh:mm:ss')
			},
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			/**
			 * 加载数据
			 */
			async loadData() {
				fetchContent().then(response => {
					this.advertiseList = response.data.advertiseList;
					this.swiperLength = this.advertiseList.length;
					this.titleNViewBackgroundList=this.advertiseList.map(t=>t.note);
					this.titleNViewBackground = this.titleNViewBackgroundList[0];

					this.homeFlashPromotion = response.data.homeFlashPromotion;
					this.listLove = response.data.listLove;
					this.listContribute5 = response.data.listContribute5;
					this.listContribute2_5 = response.data.listContribute2_5;
				});
			},
			async loadNotices() {
				const me = this;
				if (!me.listNotice.length) {
					getListNotice({
						type: 2,
						pageNum: 1,
						pageSize: 10,
					}).then(res => {
						me.listNotice.push(...res.data.list);
						me.showNotice = true;
					});
				}
				if (!me.userInfo || !me.userInfo.id) return
				getUnRead({
					type: 1
				}).then(res => {
					if (res.data) {
						setTitleNViewStyle(1, true);
					}
				});
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				let changeIndex = index % this.titleNViewBackgroundList.length;
				this.titleNViewBackground = this.titleNViewBackgroundList[changeIndex];
			},
			//商品详情页
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},

			goto(url) {
				uni.navigateTo({
					url: url
				})
			},
			gotos(url) {
				uni.reLaunch({
					url: url
				})
			}
		},
		// #ifndef MP
		onNavigationBarSearchInputConfirmed: async function(e) {
			const keyword = e.text;
			uni.navigateTo({
				url: "/pages/product/list?keyword=" + keyword
			})
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				uni.navigateTo({
					url:"/pages/public/register?inviterTelephone=" + this.userInfo.phone
				})
			} else if (index === 1) {
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		}
		// #endif
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}

	.container {
		padding-bottom: 140upx;
		background: linear-gradient(rgba(255, 255, 255, .06) 20%, #fff 30%);
	}

	/* #ifdef MP */
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
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

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	.main {
		width: 700upx;
		margin: 15px auto 0;

		/* 分类 */
		.menu {
			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;
			padding: 30upx 22upx;
			background: #fff;

			.li {
				width: 150upx;
				padding: 16upx 32upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: $font-sm + 2upx;
				color: $font-color-dark;
			}

			.li:hover,
			.li:active {
				background: radial-gradient(#ddd 0%, #fff 70%);
			}

			/* 原图标颜色太深,不想改图了,所以加了透明度 */
			image {
				width: 88upx;
				height: 88upx;
				margin-bottom: 14upx;
				border-radius: 50%;
				opacity: .7;
				box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
			}
		}

		/*消息公告*/
		.notice {
			width: 100%;
			line-height: 60upx;
			padding: 20upx;
			background-color: #fff;
			display: flex;

			.icon {
				width: 60upx;
				height: 60upx;
				margin-right: 20upx;
				background-image: url(/static/index/tt1.png);
				background-size: contain;
			}

			.cont {
				flex: 1;

				.inbox {
					width: 100%;
					height: 30px;
				}
			}

			.more {
				color: #999;
			}
		}

		.product {
			.title {
				width: 100%;
				height: 140upx;
				padding: 20upx;
				background: #fff;
				display: flex;
				align-items: center;

				image {
					flex-shrink: 0;
					width: 60upx;
					height: 60upx;
					margin-right: 20upx;
				}

				.cont {
					flex: 1;
					display: flex;
					flex-direction: column;
				}

				.tit {
					font-size: $font-lg +2upx;
					color: #font-color-dark;
					line-height: 1.3;
				}

				.tit2 {
					font-size: $font-sm;
					color: $font-color-light;
				}
			}

			.cont {
				display: flex;
				flex-wrap: wrap;
				background: #fff;

				.li {
					display: flex;
					flex-direction: row;
					width: 100%;
					padding-bottom: 40upx;
				}

				.image-wrapper {
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

				.tt {
					font-size: $font-lg;
					color: $font-color-dark;
					line-height: 80upx;
				}

				.tt2 {
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
			}
		}
	}
</style>