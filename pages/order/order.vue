<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item"
				:class="{current: tabCurrentIndex === index}" @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData('add')">
					<!-- 空白页 -->
					<empty v-if="orderList==null||orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in orderList" :key="index" class="order-item">
						<view class="inbox">
							<view class="i-top b-b">
								<text class="time"
									@click="showOrderDetail(item.id)">{{item.createTime | formatDateTime}}</text>
								<text class="state" :style="{color: '#fa436a'}">{{item.status | formatStatus}}</text>
								<text v-if="item.status===3||item.status===4"
									class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(item.id)"></text>
							</view>
							<view class="goods-box-single" v-for="(orderItem, itemIndex) in item.orderItemList"
								:key="itemIndex">
								<image class="goods-img" :src="orderItem.productPic" mode="aspectFill"></image>
								<view class="right">
									<view class="title clamp">
										{{orderItem.productName}}
										<text class="refund" @click="gotoRefundDetail(orderItem.returnId)"
											v-if="orderItem.returnId > 0 && item.status < 3">(退款详情)</text>
									</view>
									<text class="attr-box">
										{{orderItem.productAttr | formatProductAttr}} x{{orderItem.productQuantity}}
									</text>
									<text class="price">{{orderItem.productPrice}}</text>
								</view>
							</view>

							<view class="price-box">
								共
								<text class="num">{{calcTotalQuantity(item)}}</text>
								件商品 实付款
								<text class="price">{{item.payAmount}}</text>
							</view>
							<view class="action-box b-t">
								<button class="action-btn-min" @click="viewMoreBtnInfo(item,index)"
									v-if="item.status == 1||item.status == 2">更多</button>
								<span style="flex:1"></span>
								<button class="action-btn" @click="cancelOrder(item.id)"
									v-if="item.status == 0">取消订单</button>
								<button class="action-btn recom" @click="payOrder(item.id)"
									v-if="item.status == 0">立即付款</button>
								<button class="action-btn" @click="viewLogistics(item,index)"
									v-if="item.status == 2">查看物流</button>
								<button class="action-btn recom" @click="receiveOrder(item.id)"
									v-if="item.status == 2">确认收货</button>
								<button class="action-btn recom" v-if="item.status == 3&&false">评价商品</button>
							</view>
							<view class="logisticsinfo" :style="{height:showLogisticsInfo[index]?'':'0px'}">
								<view class="li">
									<view class="name">物流名称：</view>
									<view class="value">{{item.deliveryCompany}}</view>
								</view>
								<view class="li">
									<view class="name">物流单号：</view>
									<view class="value">{{item.deliverySn}}</view>
								</view>
								<view class="li">
									<view class="name">发货时间：</view>
									<view class="value">{{item.deliveryTime}}</view>
								</view>
							</view>
							<view class="morebtninfo" :style="{height:showMoreBtnInfo[index]?'':'0px'}">
								<button class="action-btn"
									v-if="item.status < 3&&item.orderItemList.filter(t=>!(t.returnId > 0)).length"
									@click="goto('/pages/order/applyRefund?orderId='+item.id)">退款</button>
							</view>
						</view>
					</view>

					<uni-load-more :status="loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
		formatDate
	} from '@/utils/date';
	import {
		fetchOrderList,
		cancelUserOrder,
		confirmReceiveOrder,
		deleteUserOrder
	} from '@/api/order.js';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				orderParam: {
					status: -1,
					pageNum: 1,
					pageSize: 5
				},
				orderList: [],
				loadingType: 'more',
				navList: [{
						state: -1,
						text: '全部'
					},
					{
						state: 0,
						text: '待付款'
					},
					{
						state: 2,
						text: '待收货'
					},
					{
						state: 3,
						text: '已完成'
					},
					{
						state: 4,
						text: '已取消'
					}
				],
				showLogisticsInfo: {},
				showMoreBtnInfo: {},
			};
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if (options.state == 0) {
				this.loadData()
			}
			// #endif

		},
		filters: {
			formatStatus(status) {
				let statusTip = '';
				switch (+status) {
					case 0:
						statusTip = '等待付款';
						break;
					case 1:
						statusTip = '等待发货';
						break;
					case 2:
						statusTip = '等待收货';
						break;
					case 3:
						statusTip = '交易完成';
						break;
					case 4:
						statusTip = '交易关闭';
						break;
				}
				return statusTip;
			},
			formatProductAttr(jsonAttr) {
				let attrArr = jsonAttr ? JSON.parse(jsonAttr) : {};
				let attrStr = '';
				for (let key in attrArr) {
					const obj = attrArr[key];
					attrStr += obj.key;
					attrStr += ":";
					attrStr += obj.value;
					attrStr += ";";
				}
				return attrStr
			},
			formatDateTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
		},
		methods: {
			//获取订单列表
			loadData(type = 'refresh') {
				if (type == 'refresh') {
					this.orderParam.pageNum = 1;
				} else {
					this.orderParam.pageNum++;
				}
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				this.orderParam.status = navItem.state;
				this.loadingType = 'loading';
				fetchOrderList(this.orderParam).then(response => {
					let list = response.data.list;
					if (type == 'refresh') {
						this.orderList = list;
						this.loadingType = 'more';
					} else {
						if (list != null && list.length > 0) {
							this.orderList = this.orderList.concat(list);
							this.loadingType = 'more';
						} else {
							this.orderParam.pageNum--;
							this.loadingType = 'noMore';
						}
					}
				});
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData();
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: '提示',
					content: '是否要删除该订单？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							deleteUserOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//取消订单
			cancelOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: '提示',
					content: '是否要取消该订单？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							cancelUserOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//支付订单
			payOrder(orderId) {
				uni.redirectTo({
					url: `/pages/money/pay?orderId=${orderId}`
				});
			},
			//确认收货
			receiveOrder(orderId) {
				let superThis = this;
				uni.showModal({
					title: '提示',
					content: '是否要确认收货？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							confirmReceiveOrder({
								orderId: orderId
							}).then(response => {
								uni.hideLoading();
								superThis.loadData();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//查看订单详情
			showOrderDetail(orderId) {
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderId=${orderId}`
				})
			},
			//计算商品总数量
			calcTotalQuantity(order) {
				let totalQuantity = 0;
				if (order.orderItemList != null && order.orderItemList.length > 0) {
					for (let item of order.orderItemList) {
						totalQuantity += item.productQuantity
					}
				}
				return totalQuantity;
			},
			//查看物流
			viewLogistics(it, at) {
				const obj = Object.assign({}, this.showLogisticsInfo)
				obj[at] = !obj[at];
				this.showLogisticsInfo = obj;
			},
			//查看物流
			viewMoreBtnInfo(it, at) {
				const obj = Object.assign({}, this.showMoreBtnInfo)
				obj[at] = !obj[at];
				this.showMoreBtnInfo = obj;
			},
			//转到指定页
			goto(url) {
				uni.navigateTo({
					url
				});
			},
			gotoRefundDetail(id) {
				uni.navigateTo({
					url: "/pages/order/detailRefund?id=" + id
				});
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		background: #fff;

		.inbox {
			width: calc(100% - 60upx);
			margin: 16upx auto;
			display: flex;
			flex-direction: column;
		}

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.refund {
					color: #d00;
					margin-left: 10px;
					font-size: 20upx;
					cursor: pointer;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn-min {
			height: 40upx;
			line-height: 40upx;
			margin: 0;
			text-align: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			border: 0;
			background: none;

			&:after {
				display: none;
			}
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}

	.logisticsinfo {
		height: 225upx;
		line-height: 65upx;
		font-size: 27upx;
		overflow: hidden;
		transition: height 0.3s ease-in-out;
	}

	.logisticsinfo .li {
		display: flex;
		justify-content: space-between;
	}

	.logisticsinfo .name {
		color: #999;
	}

	.logisticsinfo .value {
		color: #333;
	}

	.morebtninfo {
		height: 85upx;
		line-height: 55upx;
		font-size: 27upx;
		overflow: hidden;
		transition: height 0.3s ease-in-out;
	}
</style>