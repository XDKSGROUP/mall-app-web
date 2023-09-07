<template>
	<view class="main">
		<view class="tabs">
			<view class="tag" :class="{s:true}">全部(10000)</view>
			<view class="tag">最新</view>
			<view class="tag">有图(200)</view>
			<view class="tag">追加(308)</view>
		</view>
		<view class="product info" v-for="(orderItem, itemIndex) in list" :key="itemIndex">
			<view class="title">
				<image
					src="https://pinganwh.oss-cn-hangzhou.aliyuncs.com/mall/admin/images/20230817/2023081711054916226李牧.jpg">
				</image>
				<view class="r">
					<view class="name">falwdwwui</view>
					<view class="dt">{{orderItem.updateTime}}</view>
					<view class="txt">共33包</view>
				</view>
			</view>
			<view class="append">
				<view class="txt">
					很好非常好，非常棒！
				</view>
				<view class="dt">{{orderItem.updateTime}} 追评</view>
				<view class="txt">
					非常好吃
				</view>
				<view class="imgs">
					<image
						src="https://pinganwh.oss-cn-hangzhou.aliyuncs.com/mall/admin/images/20230817/2023081711054916226李牧.jpg">
					</image>
					<image
						src="https://pinganwh.oss-cn-hangzhou.aliyuncs.com/mall/admin/images/20230817/2023081711054916226李牧.jpg">
					</image>
					<image
						src="https://pinganwh.oss-cn-hangzhou.aliyuncs.com/mall/admin/images/20230817/2023081711054916226李牧.jpg">
					</image>
				</view>
			</view>
			<view class="detail">
				<view class="l">
				</view>
				<view class="r">
					<view class="look">
						<uni-icons type="hand-up" size="16"></uni-icons>
						<text>点赞</text>
					</view>
				</view>
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

	.tabs {
		margin: 20upx;
		padding: 10upx 0;
		display: flex;

		.tag {
			padding: 10upx 20upx;
			border-radius: 80upx;
			font-size: 20upx;
		}

		.s {
			color: #fff;
			background-color: #d00;
		}
	}

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
			font-weight: 500;

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
				
				.txt{width:100%;}
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

		.append {
			line-height: 40upx;
			font-size: 28upx;

			.dt {
				font-size: 12upx;
			}

			.imgs {
				image {
					width: 150upx;
					height: 150upx;
					margin: 20upx 10upx 0 0;
				}
			}
		}

		.detail {
			display: flex;
			justify-content: space-between;

			.r {
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
</style>