<template>
	<view class="main">
		<view class="product info">
			<view class="title">
				退款商品
			</view>
			<view class="cont" v-for="(orderItem, itemIndex) in items" :key="itemIndex">
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
				<view class="item" v-if="!isMoney">
					<view class="name">
						货物状态<text>*</text>
					</view>
					<view class="input">
						<picker @change="setPicker(form,[,'type'],arguments,enumGoodsStatus)"
							:range="getPickerRange(enumGoodsStatus)">
							{{form.type||"请选择"}}
							<uni-icons type="right" size="10"></uni-icons>
						</picker>
					</view>
				</view>
				<view class="item" v-if="form.type">
					<view class="name">
						退货原因<text>*</text>
					</view>
					<view class="input">
						<picker
							@change="setPicker(form,[,'reason'],arguments,form.type=='未收到货'?enumRefundMoneyReason:enumRefundGoodsReason)"
							:range="getPickerRange(form.type=='未收到货'?enumRefundMoneyReason:enumRefundGoodsReason)">
							{{form.reason||"请选择"}}
							<uni-icons type="right" size="10"></uni-icons>
						</picker>
					</view>
				</view>
				<view class="item">
					<view class="name">
						退货金额<text>*</text>
					</view>
					<view class="money">
						￥ {{money}}
					</view>
				</view>
			</view>
		</view>
		<view class="resume info">
			<view class="title">
				补充描述与任证
			</view>
			<view class="cont">
				<textarea v-model="form.description" auto-height placeholder="补充描述,有助于商家更好的处理售后问题"
					maxlength="200"></textarea>
				<view class="pics">
					<UploadImages v-model="form.files" :length="9"></UploadImages>
					<view>上传凭证(最多9张)</view>
				</view>
			</view>
		</view>
		<view class="submit">
			<button form-type="submit" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>
<script>
	import {
		fetchOrderDetail,
		applyRefund
	} from '@/api/order.js';
	import {
		enumGoodsStatus,
		enumRefundMoneyReason,
		enumRefundGoodsReason
	} from "@/utils/enums"
	import {
		setPicker,
		getPickerRange
	} from "@/utils/com"
	import UploadImages from "@/components/l/UploadImages.vue"
	export default {
		components: {
			UploadImages
		},
		data() {
			return {
				order: {},
				items: {},
				orderId: 0,
				itemId: 0,
				isMoney:0,
				money: 0,
				form: {
					type: "",
					reason: "",
					description: "",
				},
				enumGoodsStatus,
				enumRefundMoneyReason,
				enumRefundGoodsReason,
			};
		},
		onLoad(options) {
			this.isMoney=options.isMoney?true:false;
			this.isMoney&&(this.form.type="已收到货");
			console.log(this.isMoney,this.form.type)
			this.itemId = options.itemId;
			this.orderId = options.orderId;
			this.loadData();
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
		},
		methods: {
			setPicker,
			getPickerRange,
			//获取订单详细
			async loadData() {
				const me = this;
				if (!me.orderId) return;
				fetchOrderDetail(me.orderId).then(response => {
					me.order = response.data;
					me.items = me.order.orderItemList;
					me.money = me.order.payAmount;
					console.log(me.items)
					if (me.itemId) {
						me.items = me.items.filter((it, at) => it.id == me.itemId);
						me.items.length && (me.money = me.items[0].realAmount);
					}
				});
			},
			//提交
			async handleSubmit() {
				const me=this;
				const data = {
					"orderId": me.orderId,
					"orderItemIds": me.items.map(t => t.id),
					"type": me.form.type,
					"reason": me.form.reason,
					"description": me.form.description,
					"proofPics": me.form.files.map(t=>t.src).join(","),
				}
				const res = await applyRefund(data);
				if (res.code != 200) {
					me.$api.msg(res.message);
					return;
				}
				me.$api.msg(res.message);
				uni.redirectTo({
					url: '/pages/order/listRefund'
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
				justify-content: space-between;

				.input {
					text-align: right;
					flex: 1;
				}

				.name text {
					color: red;
				}

				.money {
					margin-right: 10upx;
					color: red;
				}
			}

			.item:hover,
			.item:active {
				background-color: #f6f6f6;
			}
		}
	}

	.resume {
		textarea {
			font-size: 28upx;
		}

		.pics {
			margin-top: 20upx;
		}
	}

	.submit {
		width: calc(100% - 40upx);
		margin: 0 20upx 20upx;
		position: fixed;
		bottom: 0;

		button {
			height: 60upx;
			line-height: 60upx;
			border-radius: 60upx;
			font-size: 28upx;
			color: #fff;
			background-color: crimson;
		}
	}
</style>