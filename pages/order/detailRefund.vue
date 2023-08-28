<template>
	<view class="main">
		<view class="process">
			<view class="title">
				{{currentStatus}}
			</view>
			<view class="dt">
				{{currentTime}}
			</view>
			<view class="cont">
				<view class="li" :class="{s:dicLogs['申请退款']}">申请退款</view>
				<view class="li" v-if="dicLogs['拒绝退款']" :class="{s:dicLogs['拒绝退款']}">拒绝退款</view>
				<view class="li" v-else-if="dicLogs['撤销退款']" :class="{s:dicLogs['撤销退款']}">撤销退款</view>
				<view class="li" v-else :class="{s:dicLogs['同意退款']}">退货中</view>
				<view class="li" v-if="!(dicLogs['拒绝退款']||dicLogs['撤销退款'])" :class="{s:dicLogs['退款成功']}">退款成功</view>
			</view>
		</view>
		<view class="history info">
			<view class="title">
				历史信息
			</view>
			<view class="cont">
				<li v-if="info.createTime">
					<text class="tm">{{info.createTime}}</text>
					<text class="msg">申请退款</text>
				</li>
				<li v-if="info.handleTime">
					<text class="tm">{{info.handleTime}}</text>
					<text class="msg">{{info.status===3?"拒绝退款":"同意退款"}}</text>
				</li>
				<li v-if="info.returnedTime">
					<text class="tm">{{info.returnedTime}}</text>
					<text class="msg">发货成功</text>
				</li>
				<li v-if="info.receiveTime">
					<text class="tm">{{info.receiveTime}}</text>
					<text class="msg">收货成功</text>
				</li>
				<li v-if="info.refundTime">
					<text class="tm">{{info.refundTime}}</text>
					<text class="msg">退款成功</text>
				</li>
				<li v-if="info.revokeTime">
					<text class="tm">{{info.revokeTime}}</text>
					<text class="msg">用户撤销</text>
				</li>
			</view>
		</view>
		<view class="product info">
			<view class="title">
				退款商品
			</view>
			<view class="prms" v-if="info.status==2">
				<view class="li">
					<view class="name">收货人</view>
					<view class="value">{{address.name}}</view>
				</view>
				<view class="li">
					<view class="name">退货地址</view>
					<view class="value">{{address.province}} {{address.city}} {{address.region}}
						{{address.detailAddress}}
					</view>
				</view>
			</view>
			<view class="cont">
				<image class="img" :src="info.productPic" mode="aspectFill"></image>
				<view class="right">
					<text class="tt clamp">
						{{info.productName}}
					</text>
					<text class="attr-box">
						{{info.productAttr | formatProductAttr}} x{{info.productCount}}
					</text>
				</view>
			</view>
			<view class="prms">
				<view class="li">
					<view class="name">退款原因</view>
					<view class="value">{{info.reason}}</view>
				</view>
				<view class="li">
					<view class="name">退款金额</view>
					<view class="value">￥{{info.productPrice}}</view>
				</view>
				<view class="li">
					<view class="name">申请时间</view>
					<view class="value">{{info.createTime}}</view>
				</view>
				<view class="li">
					<view class="name">退款编号</view>
					<view class="value">{{info.id}}</view>
				</view>
				<view class="li">
					<view class="name">凭证</view>
					<view class="value">
						<image class="img" v-for="(it,at) in (info.proofPics?info.proofPics.split(','):[])" :key="at"
							:src="it" mode="aspectFill"></image>
					</view>
				</view>
				<view class="li">
					<view class="name">详细描述</view>
					<view class="value">{{info.description}}</view>
				</view>
				<view class="li">
					<view class="name">物流公司</view>
					<view class="value">{{info.deliveryCompany}}</view>
				</view>
				<view class="li">
					<view class="name">物流编号</view>
					<view class="value">{{info.deliverySn}}</view>
				</view>
			</view>
		</view>
		<view class="submit">
			<button @click="showRefundGoods" class="button" v-if="info.status==2">填写退货信息</button>
			<button form-type="submit" @click="handleSubmit" v-if="false">联系客服</button>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="" title="填写退货信息" :before-close="true" @confirm="setRefundGoods"
				@close="hideRefundGoods">
				<div class="form">
					<input type="text" v-model="form.deliveryCompany" placeholder="物流名称" maxlength="20" class="input" />
					<input type="text" v-model="form.deliverySn" placeholder="物流单号" maxlength="30" class="input" />
				</div>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>
<script>
	import {
		detailRefund,
		setRefundGoods,
	} from '@/api/order.js';
	export default {
		data() {
			return {
				id: 0,
				info: {},
				currentStatus: "",
				currentTime: "",
				form: {
					deliveryCompany: "",
					deliverySn: "",
				},
				dicLogs: {},
				address: {}
			};
		},
		onLoad(options) {
			this.id = options.id;
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
			setCurrent() {
				const me = this,
					log = me.info.log[me.info.log.length - 1];
				me.currentStatus = log.operateType;
				me.currentTime = log.operateTime;
				me.info.log.forEach((it) => me.dicLogs[it.operateType] = it);
				me.address = me.info.address || {};
			},
			//获取订单详细
			async loadData() {
				const me = this;
				if (!me.id) return;
				detailRefund({
					id: me.id
				}).then(response => {
					me.info = response.data;
					me.setCurrent();
				});
			},
			showRefundGoods() {
				this.$refs.popup.open();
			},
			hideRefundGoods() {
				this.$refs.popup.close();
			},
			//获取订单详细
			async setRefundGoods() {
				const me = this;
				if (!me.id) return;
				me.form.id = me.id;
				setRefundGoods(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg(res.message);
					me.gotoDetail();
				});
			},
			//跳转到申请页
			async gotoDetail() {
				uni.redirectTo({
					url: '/pages/order/detailRefund'
				})
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

	.process {
		margin: 20upx;
		padding: 20upx;
		background-color: #fff;
		border-radius: 20upx;

		.title {
			padding: 20upx 0;
			font-size: 30upx;
			font-weight: 600;
			text-align: center;
		}

		.dt {
			margin-bottom: 20upx;
			padding: 0 0 20upx;
			font-size: 24upx;
			color: #999;
			border-bottom: 1px solid #eee;
			text-align: center;
		}

		.cont {
			width: 80%;
			margin: 0 auto;
			padding: 20upx 0 10upx;
			color: #666;
			line-height: 46upx;
			font-size: 28upx;
			display: flex;
			justify-content: center;

			.li {
				flex: 1;
				text-align: center;
				position: relative;
			}

			.li::before {
				content: "";
				width: 10upx;
				height: 10upx;
				margin: 0 auto 10upx;
				border: 1px solid red;
				background-color: #fff;
				display: block;
				position: relative;
				z-index: 1;
				border-radius: 50%;
			}

			.li::after {
				content: "";
				width: calc(100%);
				height: 1px;
				background-color: red;
				right: 0;
				top: 6upx;
				position: absolute;
			}

			.li:first-child.li::after {
				content: "";
				width: calc(50%);
				height: 1px;
				background-color: red;
				right: 0;
				top: 6upx;
				position: absolute;
			}

			.li:last-child.li::after {
				content: "";
				width: calc(50%);
				height: 1px;
				background-color: red;
				left: 0;
				top: 6upx;
				position: absolute;
			}

			.s::before {
				background-color: red;
			}
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

		.prms {
			.li {
				line-height: 50upx;
				font-size: 25upx;
				display: flex;

				.name {
					width: 200upx;
					color: #999;
				}

				.value {}

				.img {
					width: 100upx;
					height: 100upx;
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

	.submit {
		width: calc(100% - 40upx);
		margin: 0 20upx 20upx;

		.button {
			height: 60upx;
			line-height: 60upx;
			border-radius: 60upx;
			font-size: 28upx;
			color: #fff;
			background-color: crimson;
		}
	}

	.form {
		width: 100%;
		display: flex;
		flex-direction: column;

		.input {
			height: 60upx;
			line-height: 60upx;
			padding: 10upx;
			margin-bottom: 20upx;
			font-size: 14px;
			border: 1px solid #eee;
			border-radius: 10upx;
		}
	}
</style>