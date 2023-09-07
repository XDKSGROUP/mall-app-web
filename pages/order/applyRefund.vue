<template>
	<view class="main">
		<view class="product info">
			<view class="title">
				退款商品
			</view>
			<view class="cont" v-for="(orderItem, itemIndex) in order.orderItemList" :key="itemIndex"
				v-show="!(orderItem.returnId>0)">
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
				选择服务类型
			</view>
			<view class="cont">
				<view class="item"
					@click="goto('/pages/order/applyRefundForm?orderId='+orderId+(itemId?'&itemId='+itemId:'')+'&isMoney=1')">
					<img src="/static/order/icon_money.svg" class="icon" />
					<view class="li">
						<view class="tt">
							我要退款（无需退货）
						</view>
						<view class="txt">
							没收到货，或与卖家协商同事不用退货只退款
						</view>
						</div>
					</view>
					<img src="/static/order/icon_in.svg" class="in" />
				</view>
				<view class="item"
					@click="goto('/pages/order/applyRefundForm?orderId='+orderId+(itemId?'&itemId='+itemId:''))">
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
	import {
		fetchOrderDetail
	} from '@/api/order.js';
	export default {
		data() {
			return {
				order: {},
				orderId: 0,
				itemId: 0,
			};
		},
		onLoad(options) {
			this.itemId = options.itemId;
			this.orderId = options.orderId;
			this.loadData()
		},
		filters: {
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
			}
		},
		methods: {
			//获取订单详细
			async loadData() {
				if (!this.orderId) return;
				fetchOrderDetail(this.orderId).then(response => {
					this.order = response.data;
				});
			},
			//跳转到申请页
			async goto(url) {
				uni.navigateTo({
					url: url
				});
			},
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