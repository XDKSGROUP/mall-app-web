<template>
	<view class="main">
		<view class="product info" v-for="(orderItem, itemIndex) in list" :key="itemIndex">
			<view class="title">
				<view>
					<text>{{orderItem.type=="已收到货"?"退货":"退款"}}</text>
					<text style="margin:0 5upx;">-</text>
					<text class="status"
						:class="{s:orderItem.status==1||orderItem.status==2||orderItem.status==3||orderItem.status==4}">{{orderItem.status|getStatus}}</text>
				</view>
				<view class="dt">{{orderItem.updateTime}}</view>
			</view>
			<view class="cont">
				<image class="img" :src="orderItem.productPic" mode="aspectFill"></image>
				<view class="right">
					<text class="tt clamp">
						{{orderItem.productName}}
					</text>
					<text class="attr-box">
						{{orderItem.productAttr | formatProductAttr}} x{{orderItem.productCount}}
					</text>
					<view class="price">
						退款：<text class="pc">{{orderItem.productRealPrice}}</text>
					</view>
				</view>
			</view>
			<view class="detail">
				<view @click="gotoDetail(orderItem.id)" class="btn">查看详细</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		fetchOrderDetail,
		listRefund,
	} from '@/api/order.js';
	import {
		enumRefundStatus
	} from "@/utils/enums"
	export default {
		data() {
			return {
				list: [],
				form: {
					pageNum: 1,
					pageSize: 15,
				},

			};
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
		onLoad(options) {
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
			},
			getStatus(status) {
				const it = enumRefundStatus.filter(t => t.value == status)[0];
				return it ? it.name : "";
			}
		},
		methods: {
			//获取订单详细
			async loadData(isAppend) {
				const me = this;
				if (isAppend) {
					me.form.pageNum++;
				} else {
					me.form.pageNum = 1;
				}

				listRefund(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
					}

					if (!isAppend) me.list.splice(0, me.list.length);
					me.list.push(...res.data.list);
				});
			},
			//跳转到详细页
			async gotoDetail(id) {
				uni.navigateTo({
					url: "/pages/order/detailRefund?id=" + id
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
			padding: 10upx 0 20upx;
			font-size: 28upx;
			font-weight: 600;
			border-bottom: 1px solid #eee;
			display: flex;
			justify-content: space-between;
		}

		.dt {
			font-weight: 500;
			color: #999;
		}

		.cont {
			color: #666;
			line-height: 46upx;
			font-size: 28upx;
		}
	}

	.product {
		.title {
			.status {
				font-weight: 400;
				color: #ccc;
			}

			.status.s {
				color: firebrick;
			}
		}

		.cont {
			line-height: 40upx;
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
				}

				.pc:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.detail {
			display: flex;
			justify-content: right;

			.btn {
				width: 160upx;
				line-height: 50upx;
				font-size: 28upx;
				text-align: center;
				color: red;
				border: 1px solid red;
				border-radius: 50upx;
			}
		}
	}
</style>