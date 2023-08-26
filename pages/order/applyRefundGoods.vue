<template>
	<view class="main">
		<view v-for="(orderItem, itemIndex) in item.orderItemList" :key="itemIndex" class="product info">
			<view class="title">
				退款商品
			</view>
			<view class="cont">
				<image class="img" :src="orderItem.productPic" mode="aspectFill"></image>
				<view class="right">
					<text class="tt clamp">
						{{orderItem.productName}}
					</text>
					<text class="attr-box">
						{{orderItem.productAttr | formatProductAttr}} x{{orderItem.productQuantity}}
					</text>
					<text class="price">
						{{orderItem.productPrice}}
					</text>
				</view>
			</view>
		</view>
		<view class="type info">
			<view class="title">
				退款信息
			</view>
			<view class="cont">
				<view class="item">
					<view>
						货物状态*
					</view>
					<view>
						<picker :value="form.status" @change="changeStatus()" :range="listStatus">
							<input placeholder="起始交易时间" :value="form.donationTimeStart" />
							<uni-icons type="bottom" size="10"></uni-icons>
						</picker>
						请选择
					</view>
				</view>
				<view class="item">
					<img src="/static/order/icon_goods.svg" class="icon" />
					<view class="li">
						<view class="tt">
							我要退货退款
						</view>
						<view class="txt">
							已收到货，需要退还收到的货物
						</view>
						</div>
					</view>
					<img src="/static/order/icon_in.svg" class="in" />
				</view>
			</view>
		</view>
		<view class="resume info">
			<view class="title">
				我的服务
			</view>
			<view class="cont">
				退货保障：买家个人原因由买家自行承担运费，商家原因由商家承担运费
			</view>
		</view>
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
				showLogisticsInfo: {},
				item: {},
				form: {},
				listStatus: [{
						name: "未收到货",
						value: 1
					},
					{
						name: "已收到货",
						value: 2
					},
				],
			};
		},
		onLoad(options) {
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
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				this.loadingType = 'loading';
				fetchOrderList(this.orderParam).then(response => {
					let list = response.data.list;
					this.item = list.length ? list[0] : {};
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
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.main {}

	.info {
		margin: 20upx;
		padding: 20upx;
		background-color: #fff;
		border-radius: 20upx;

		.title {
			margin-bottom: 20upx;
			padding: 20upx 0;
			font-size: 28upx;
			font-weight: 600;
			border-bottom: 1px solid #eee;
		}

		.cont {
			color: #666;
			line-height: 46upx;
			font-size: 28upx;
		}
	}

	.product {

		.cont {
			line-height: 30upx;
			display: flex;
			padding: 20upx 0;

			.img {
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

				.tt {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
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
	}

	.type {
		.cont {
			.item {
				padding: 30upx 20upx;
				display: flex;
				border-radius: 15upx;

				.icon {
					width: 80upx;
					margin-right: 20upx;
				}

				.li {
					flex: 1;
					padding: 0 20upx;
				}

				.tt {
					color: #333;
					font-weight: 600;
				}

				.in {
					width: 40upx;
				}
			}

			.item:hover,
			.item:active {
				background-color: #f6f6f6;
			}
		}
	}
</style>