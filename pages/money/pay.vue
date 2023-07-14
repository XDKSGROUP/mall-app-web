<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderInfo.payAmount}}</text>
		</view>

		<view class="pay-type-list">
			<view class="type-item b-b" @click="changePayType(3)">
				<uni-icons type="heart-filled" size="30" color="#fa436a" class="icon"></uni-icons>
				<view class="con">
					<text class="tit">爱心值支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='form.payType == 3' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(4)" v-if="userInfo.isBuySpecific">
				<uni-icons type="flag-filled" size="30" color="#36cb59" class="icon"></uni-icons>
				<view class="con">
					<text class="tit">贡献值支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='form.payType == 4' />
					</radio>
				</label>
			</view>
			<view class="lastinfo">
				<view>当前剩余爱心值：{{userInfo.integral}}</view>
				<view>当前剩余贡献值：{{userInfo.money}}</view>
			</view>
			<!--<view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='form.payType == 2' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='form.payType == 1' />
					</radio>
				</label>
			</view>-->
		</view>

		<text class="mix-btn" @click="showPassword">确认支付</text>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="" title="支付确认" :before-close="true" @confirm="confirm" @close="hidePassword">
				<input type="password" v-model="form.paymentPassword" placeholder="请输入6位数支付密码" maxlength="6"
					class="placeholder" />
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		fetchOrderDetail,
		payOrderProduct
	} from '@/api/order.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		getMeInfo,
	} from '@/api/me.js';
	export default {
		data() {
			return {
				form: {
					orderId: undefined,
					payType: 4,
					paymentPassword: undefined,
				},
				orderInfo: {}
			};
		},
		onLoad(options) {
			const me = this,
				form = me.form;
			if (!me.userInfo.isBuySpecific) form.payType = 3;
			form.orderId = options.orderId;
			fetchOrderDetail(form.orderId).then(response => {
				this.orderInfo = response.data;
			});
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			//显示密码框
			showPassword() {
				this.$refs.popup.open();
			},
			hidePassword() {
				this.$refs.popup.close();
			},
			//选择支付方式
			changePayType(type) {
				this.form.payType = type;
			},
			//确认支付
			confirm: async function() {
				const me = this;
				if (!me.form.paymentPassword) {
					me.$api.msg(`请输入支付密码`);
					return;
				}
				payOrderProduct(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					getMeInfo().then(res => {
						me.login(res.data);
						uni.redirectTo({
							url: '/pages/money/paySuccess'
						})
					});

				});
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 30upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.lastinfo {
		margin: 10upx 0 0;
		line-height: 80upx;
	}

	.placeholder {
		height:60upx;
		line-height:60upx;
		padding: 10upx;
		font-size:14px;
		border: 1px solid #eee;
		border-radius: 10upx;
	}
</style>