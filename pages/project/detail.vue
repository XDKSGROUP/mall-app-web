<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in [(form.pic||'').replace(/^\s+/,'')]"
					:key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="params">
			<text class="tt">{{form.name}}</text><br>
			<text class="tt2">{{form.info}}</text>
			<view class="price-box">
				项目进度：<text class="price">{{form.raisedMoney}}/{{form.targetMoney}}</text>
			</view>
			<view class="institution">
				<text>慈善接收：{{form.donationsReceiver}}</text>
				<text>执行机构：{{form.actuator}}</text>
			</view>
		</view>

		<!-- 项目进度 -->
		<view class="progress">
			<view class="title">
				<text>项目进度</text>
			</view>
			<view class="cont">
				<view class="li">
					<rich-text class="text" :nodes="form.progressContent"></rich-text>
				</view>
			</view>
		</view>

		<view class="detail">
			<view class="title">
				<text>项目介绍</text>
			</view>
			<view class="cont">
				<rich-text :nodes="form.introduction"></rich-text>
			</view>
		</view>


		<view class="detail">
			<view class="title">
				<text>项目相关信息</text>
			</view>
			<view class="cont">
				<rich-text :nodes="form.implementation"></rich-text>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/project/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="setAttention">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			<view class="auto"></view>
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="showPassword">立即捐赠</button>
			</view>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="确认捐献" :before-close="true" @confirm="confirm" @close="hidePassword">
				<view class="contribute">
					<view class="li">
						<view class="label">金额：</view>
						<view class="val">
							<input type="number" v-model="payForm.donationAmount"
								@input="changeMoney('donationAmount',arguments)" placeholder="请输入金额" class="input" />
						</view>
					</view>
					<view class="li">
						<view class="label">支付方式：</view>
						<view class="val">
							<view class="ti" @click="changePayType(0)">
								<radio value="" color="#fa436a" :checked='payForm.donationType == 0' />
								</radio>
								<uni-icons type="heart-filled" size="26" color="#fa436a" class="icon"></uni-icons>
								<view class="con">
									<text class="tit">爱心值支付</text>
								</view>
							</view>
							<view class="ti" @click="changePayType(1)">
								<radio value="" color="#fa436a" :checked='payForm.donationType == 1' />
								</radio>
								<uni-icons type="flag-filled" size="26" color="#36cb59" class="icon"></uni-icons>
								<text class="tit">贡献值支付</text>
							</view>
						</view>
					</view>
					<view class="li">
						<view class="label">支付密码：</view>
						<view class="val">
							<input type="password" v-model="payForm.paymentPassword" placeholder="请输入6位数支付密码"
								maxlength="6" class="input" />
						</view>
					</view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getDetail
	} from '@/api/project.js';
	import {
		addProjectAttention,
		getProjectAttention,
		delProjectAttention,
	} from '@/api/me.js';
	import {
		mapState
	} from 'vuex';
	import {
		formatDate
	} from '@/utils/date';
	import {
		payOrderProject
	} from '@/api/order.js';

	export default {
		data() {
			return {
				form: {
					id: 0,
					name: undefined, //名称
					pic: undefined, //图片
					categoryId: undefined, //类目
					info: undefined, //简介
					donationsReceiver: undefined, //接收机构
					actuator: undefined, //执行机构
					introduction: undefined, //详细
					targetMoney: undefined, //目标总额
					raisedMoney: undefined, //当前总额
					donationsNumber: undefined, //捐赠人次
					followersNumber: undefined, //收藏数
				},
				payForm: {
					projectId: undefined,
					donationAmount: undefined,
					donationType: 1,
				},
				favorite: false,
			};
		},
		async onLoad(options) {
			const me = this;
			me.form.id = options.id;
			me.payForm.projectId = options.id;
			me.loadData();
			me.loadAttention();
		},
		computed: {
			...mapState(['hasLogin'])
		},
		filters: {
			formatDateTime(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
		},
		methods: {
			changeMoney(name, args) {
				const me = this;
				const newValue = args[0].target.value;
				me.$nextTick(() => {
					me.payForm[name] = newValue.replace(/[^0-9.]/g, "");
				});
			},
			//显示密码框
			showPassword() {
				this.$refs.popup.open();
			},
			//隐藏密码框
			hidePassword() {
				this.$refs.popup.close();
			},
			//选择支付方式
			changePayType(type) {
				this.payForm.donationType = type;
			},
			//确认支付
			confirm: async function() {
				const me = this;
				if (!me.payForm.donationAmount) {
					me.$api.msg(`请输入捐献金额`);
					return;
				}
				if (!me.payForm.paymentPassword) {
					me.$api.msg(`请输入支付密码`);
					return;
				}
				payOrderProject(me.payForm).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					uni.redirectTo({
						url: '/pages/money/paySuccessProject'
					})
				});
			},

			async loadData() {
				const me = this;
				getDetail(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					Object.assign(me.form, res.data);
				});
			},
			//设置关注
			setAttention() {
				const me = this;
				if (me.favorite) {
					me.delAttention();
				} else {
					me.addAttention();
				}
				me.favorite = !me.favorite;
			},
			//加载关注状态
			loadAttention() {
				const me = this;
				getProjectAttention({
					projectId: me.form.id
				}).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.favorite = res.data.id;
				});
			},
			//添加关注
			addAttention() {
				const me = this;
				addProjectAttention({
					projectId: me.form.id
				}).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg("完成收藏");
				});
			},
			//删除关注
			delAttention() {
				const me = this;
				delProjectAttention({
					projectId: me.form.id
				}).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg("已取消收藏");
				});
			},
		},
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.container {
		width: 750upx;
		margin: auto;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 参数信息 */
	.params {
		background: #fff;
		padding: 20upx 30upx;

		.tt {
			height: 80upx;
			line-height: 80upx;
			font-size: 36upx;
			color: $font-color-dark;
		}

		.tt2 {
			font-size: 28upx;
			color: $font-color-light;
			height: 46upx;
			line-height: 46upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: #333;
		}

		.price {
			color: $uni-color-primary;
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}

		.institution {
			line-height: 60upx;
			margin: 15upx 0 0;
			padding: 20upx 0 0;
			border-top: 1upx solid #ccc;
			font-size: $font-base;
			color: #999;

			text {
				display: block;
			}
		}
	}

	.title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		position: relative;

		text {
			padding: 0 20upx;
			background: #fff;
			position: relative;
			z-index: 1;
		}

		&:after {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%);
			width: 300upx;
			height: 0;
			content: '';
			border-bottom: 1px solid #ccc;
		}
	}

	/* 详情 */
	.detail {
		background: #fff;
		margin-top: 16upx;

		.cont {
			line-height: 50upx;
			padding: 30upx;
			font-size: $font-base;
			color: $font-color-base;
		}
	}

	.progress {
		margin-top: 16upx;
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.cont {
			padding: 10upx 30upx;

			.li {
				margin: 10px 0;
			}

			.h1 {
				display: flex;
				flex-direction: column;
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.h2 {
				display: flex;
				flex-direction: column;
				font-size: $font-base;
				color: $font-color-light;
			}

			.text {
				line-height: 50upx;
				margin-top: 10upx;
				font-size: $font-base;
				color: $font-color-base;
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 700upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .1);
		border-radius: 16upx;

		.auto {
			flex: 1;
		}

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin: 0 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}


	.contribute {
		width: 100%;
		line-height: 64upx;
		font-size: 16px;

		.label {
			width: 170upx;
			vertical-align: middle;
		}

		.val {
			vertical-align: middle;
			flex: 1;
		}

		.li {
			display: flex;
			padding: 20upx 0;
		}


		.ti {
			height: 60upx;
			display: flex;
			justify-content: space-between;
			vertical-align: middle;
			position: relative;
		}

		radio {
			display: flex;
		}

		.icon {
			width: 100upx;
			font-size: 40upx;
		}

		.tit {
			color: $font-color-dark;
		}

		/* 损赠金额 */
		.input {
			height: 68upx;
			border: 1px solid #f1f1f1;
			padding: 0 12upx;
		}

	}
</style>