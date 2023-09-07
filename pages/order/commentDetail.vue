<template>
	<view class="main">
		<view class="product info" v-for="(orderItem, itemIndex) in list.slice(0,1)" :key="itemIndex">
			<view class="title">
				<image
					src="https://pinganwh.oss-cn-hangzhou.aliyuncs.com/mall/admin/images/20230817/2023081711054916226李牧.jpg">
				</image>
				<view class="r">
					<view class="name">falwdwwui</view>
					<view class="dt">{{orderItem.updateTime}}</view>
					<view class="txt">很好非常好，非常棒！</view>
				</view>
			</view>
			<view class="cont">
				<image class="img" :src="orderItem.productPic" mode="aspectFill"></image>
				<view class="right">
					<text class="tt clamp">
						{{orderItem.productName}}
					</text>
					<text class="attr-box">
						{{orderItem.productAttr | formatProductAttr}} x {{orderItem.productCount}}
					</text>
					<view class="price">
						退款：<text class="pc">{{orderItem.productRealPrice}}</text>
					</view>
				</view>
			</view>
			<view class="detail">
				<view class="l">
					<view class="look">
						<uni-icons type="eye" size="16"></uni-icons>
						<text>2</text>
					</view>
					<view class="look">
						<uni-icons type="chatbubble" size="16"></uni-icons>
						<text>评论</text>
					</view>
					<view class="look">
						<uni-icons type="hand-up" size="16"></uni-icons>
						<text>点赞</text>
					</view>
				</view>
			</view>
		</view>
		<view class="comment info" v-for="(orderItem, itemIndex) in list.slice(0,1)" :key="itemIndex">
			<view class="title">全部评论(1)</view>
			<view class="cont">
				<view class="item">
					<view class="u">
						<image
							src="https://pinganwh.oss-cn-hangzhou.aliyuncs.com/mall/admin/images/20230817/2023081711054916226李牧.jpg">
						</image>
						<view class="r">
							<view class="name">falwdwwui</view>
							<view class="dt">{{orderItem.updateTime}}</view>
						</view>
					</view>
					<view class="txt">很好非常好，非常棒！</view>
				</view>

				<view class="item">
					<view class="u">
						<image
							src="https://pinganwh.oss-cn-hangzhou.aliyuncs.com/mall/admin/images/20230817/2023081711054916226李牧.jpg">
						</image>
						<view class="r">
							<view class="name">falwdwwui</view>
							<view class="dt">{{orderItem.updateTime}}</view>
						</view>
					</view>
					<view class="txt">我也是这么诊断！</view>
				</view>
			</view>
		</view>
		<view class="reply info">
			<textarea class="textarea" v-model="form.description" auto-height placeholder="点击输入回复,请文明用语"
				maxlength="200"></textarea>
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
		position: relative;
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
			image {
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
			}

			.r {
				margin-left: 20upx;
				display: flex;
				flex: 1;
				flex-wrap: wrap;
			}

			.name {
				flex: 1;
			}

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
			justify-content: space-between;

			.l {
				font-size: 20upx;
				display: flex;
				justify-content: left;

				.look {
					margin-right: 20upx;
				}

				text {
					margin-left: 10upx;
				}
			}
		}
	}
	
	.comment{
		.item{
			margin-bottom: 20upx;
			.u{
				margin-bottom: 20upx;
				display: flex;
				align-items: center;
				.r{
					margin-left:20upx;
					display: flex;
					flex:1;
					justify-content: space-between;}
			}
			image {
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
			}
		}
		.item:nth-child(2n){
			border-top:1px dashed #eee;
			padding-top:20upx;
		}
	}

	.reply {
		width: calc(100% - 40upx);
		
		padding:10upx;
		display: flex;
		position: fixed;
		bottom: 0;
		.textarea {
			line-height:40upx;
			flex:1;
			display: block;
		}
	}
</style>