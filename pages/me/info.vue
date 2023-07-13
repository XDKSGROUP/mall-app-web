<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" src="/static/me/normal_bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.icon || '/static/me/user-head.png'"></image>
				</view>
				<view class="info-box">
					<view class="username">
						{{userInfo.nickname&&userInfo.nickname.length>10?userInfo.nickname.substring(0,10)+"...":userInfo.nickname || '平安建设基金会'}}
					</view>
					<view class="job">角色：{{userInfo.memberLevelName||"公民"}}</view>
					<view class="lv">等级：{{userInfo.memberHonorLevelName||"P0"}}</view>
					<view class="lv">帐号：{{userInfo.username||"***"}}</view>
				</view>
			</view>
		</view>

		<view class="cover-container" :style="[{
				transform: coverTransform,
				transition: coverTransition
			}]" @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">
			<image class="arc" src="/static/arc.png"></image>

			<view class="tj-sction">
				<view class="inbox">
					<view class="tj-item" @click="navTo('/pages/me/valuelove')">
						<text class="num">{{userInfo.integral || '0'}}</text>
						<text>爱心值</text>
					</view>
					<view class="tj-item" @click="navTo('/pages/me/valuecontribute')">
						<text class="num">{{userInfo.money || '0'}}</text>
						<text>贡献值</text>
					</view>
					<view class="tj-item" @click="navTo('/pages/me/valuenetwork')">
						<text class="num">{{userInfo.networkValue || '0'}}</text>
						<text>人脉值</text>
					</view>
					<view class="tj-item" @click="navTo('/pages/me/valueteam')">
						<text class="num">{{userInfo.teamValue || '0'}}</text>
						<text>团队值</text>
					</view>
				</view>
				<view @click="refresh()" class="refresh">
				</view>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?state=0')" hover-class="common-hover"
					:hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover"
					:hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=2')" hover-class="common-hover"
					:hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>待收货</text>
				</view>
				<view class="order-item" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan"></text>
					<text>退款/售后</text>
				</view>
			</view>
			<!-- 菜单 -->
			<view class="menu2">
				<view class="order-item" @click="navTo('/pages/me/contribute')" hover-class="common-hover"
					:hover-stay-time="50">
					<image src="/static/me/lb1.png"></image>
					<text>我的捐款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/me/project')" hover-class="common-hover"
					:hover-stay-time="50">
					<image src="/static/me/lb2.png"></image>
					<text>我的项目</text>
				</view>
				<view class="order-item" @click="navTo('/pages/me/invite')" hover-class="common-hover"
					:hover-stay-time="50">
					<image src="/static/me/lb3.png"></image>
					<text>公益名片</text>
				</view>
			</view>
			<!-- 菜单 -->
			<view class="menu">
				<view class="title">
					<view class="li" :class="achievementType==0?'s':''" @click="achievementType=0">
						<text>公益成就({{userInfo.publicWelfareAchievement||0}}/20)</text>
					</view>
					<!-- <view class="li" :class="achievementType==1?'s':''" @click="achievementType=1">
						<text>慈善成就({{userInfo.charityAchievement||0}}/20)</text>
					</view> -->
				</view>
				<view class="cont" v-if="achievementType==0">
					<view class="li" v-for="num in (userInfo.publicWelfareAchievement||0)">
						<image src="/static/me/love_f.svg"></image>
					</view>
					<view class="li" v-for="num in 20-(userInfo.publicWelfareAchievement||0)">
						<image src="/static/me/love_fy.svg"></image>
					</view>
				</view>
				<view class="cont" v-if="achievementType==1">
					<view class="li" v-for="num in (userInfo.charityAchievement||0)">
						<image src="/static/me/love_f.svg"></image>
					</view>
					<view class="li" v-for="num in 20-(userInfo.charityAchievement||0)">
						<image src="/static/me/love_fy.svg"></image>
					</view>
				</view>
			</view>
			<!-- 菜单 -->
			<view class="history-section icon">
				<list-cell icon="icon-shoucang" iconColor="#dd6666" title="爱心申购" v-if="userInfo.memberLevelId==5"
					@eventClick="navTo('/pages/me/recharge')"></list-cell>
				<list-cell icon="icon-share" iconColor="#ee77cc" title="爱心传递"
					@eventClick="navTo('/pages/me/movelove')"></list-cell>
				<list-cell icon="icon-share" iconColor="#32cd66" title="贡献传递"
					@eventClick="navTo('/pages/me/movecontribute')"></list-cell>
				<list-cell icon="icon-share" iconColor="#32cd66" title="爱心提现"
					@eventClick="navTo('/pages/me/withdrawallove')"></list-cell>
				<list-cell icon="icon-share" iconColor="#32cd66" title="贡献提现"
					@eventClick="navTo('/pages/me/withdrawalcontribute')"></list-cell>
				<list-cell icon="icon-comment" iconColor="#77cda2" title="联系客服"
					@eventClick="navTo('/pages/me/contactus')"></list-cell>
				<list-cell icon="icon-bangzhu" iconColor="#e07472" title="帮助中心"
					@eventClick="navTo('/pages/help/list')"></list-cell>
				<list-cell icon="icon-tuijian" iconColor="#5fcda2" title="关于我们"
					@eventClick="navTo('/pages/me/aboutus')"></list-cell>
				<list-cell icon="icon-yishouhuo" iconColor="#54b4ef" title="义工系统"
					@eventClick="navTo('/pages/help/volunteer')"></list-cell>
			</view>
		</view>


	</view>
</template>
<script>
	import listCell from '@/components/mix-list-cell';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		getUnRead
	} from '@/api/notice.js';
	import {
		setTitleNViewStyle
	} from '@/utils/extUni.js';
	import {
		getMeInfo,
	} from '@/api/me.js';

	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			listCell
		},
		data() {
			return {
				achievementType: 0, //成就类型
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				couponCount: null
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad() {},
		onShow() {
			this.loadNotices();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/me/set');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			async loadNotices() {
				const me = this;
				if (!me.userInfo || !me.userInfo.id) return;
				getUnRead({
					type: 1
				}).then(res => {
					if (res.data) {
						setTitleNViewStyle(1, true);
					}
				})
			},
			...mapMutations(['login']),
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				})
			},

			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				const me = this;
				if (me.moving === false) {
					return;
				}
				me.moving = false;
				me.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				me.coverTransform = 'translateY(0px)';
				me.refresh();
			},
			refresh() {
				const me = this;
				getMeInfo().then(res => {
					me.login(res.data);
					uni.switchTab({
						url: "/pages/me/info"
					})
				});
			}
		}
	}
</script>
<style lang='scss'>
	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}

	.user-section {
		height: 520upx;
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}

	.user-info-box {
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait-box {
			width: 130upx;
			height: 130upx;
			background-color: #fff;
			border-radius: 50%;
		}

		.portrait {
			width: 130upx;
			height: 130upx;
			border: 5upx solid #fff;
			border-radius: 50%;
		}

		.info-box {
			margin-left: 20upx;
			color: #fff;
		}

		.username {
			font-size: $font-lg + 6upx;
		}

		.lv {
			font-size: $font-lg;
		}

		.job {
			font-size: $font-lg;
		}

	}

	.vip-card-box {
		display: flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0, 0, 0, .7), rgba(0, 0, 0, .8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;

		.card-bg {
			position: absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}

		.b-btn {
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}

		.tit {
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;

			.yticon {
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}

		.e-b {
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}

	.cover-container {
		margin: -150upx auto 0;
		padding: 0 30upx 20upx;
		position: relative;
		background: $page-color-base;
		background: #f5f5f5;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}

	.tj-sction {
		background: #fff;
		border-radius: 5px;
		overflow: hidden;
		position: relative;

		.inbox {
			display: flex;
			justify-content: space-around;
			align-content: center;

			.tj-item {
				@extend %flex-center;
				flex-direction: column;
				height: 140upx;
				font-size: $font-sm;
				color: #75787d;
			}

			.num {
				font-size: $font-lg;
				color: $font-color-dark;
				margin-bottom: 8upx;
			}
		}

		.refresh {
			width: 100%;
			height: 10px;
			font-size: 10px;
			text-align: center;
			color:#ccc;
			background-color: rgba(255, 255, 255,0.1);
			position: absolute;
			bottom: 0;
			border-radius: 100% 100% 0 0;
		}
		.refresh:active{
			background-color: rgba(241, 93, 107,0.3);
		}
	}

	.order-section {
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;

		.order-item {
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}

		.yticon {
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}

		.icon-shouhoutuikuan {
			font-size: 44upx;
		}
	}

	.history-section {
		padding: 30upx 0 0;
		margin-top: 20upx;
		margin-bottom: 120upx;
		background: #fff;
		border-radius: 10upx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}

	.menu {
		padding: 28upx 0;
		margin-top: 20upx;
		background-color: #fff;
		border-radius: 5px;

		.title {
			margin: 0 15upx;
			display: flex;

			.li {
				height: 60upx;
				line-height: 60upx;
				padding: 0 20upx;
				margin-right: 20upx;
				border-radius: 10upx;
				font-size: $font-sm;
				color: $font-color-dark;
				background-color: #fff;
			}

			.s {
				background-color: #f7d680;
			}
		}

		.cont {
			width: 100%;
			padding: 20px 0 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;

			.li {
				display: inline-block;
				width: 60upx;
				margin: 0 2px;

				image {
					width: 100%;
					height: 60upx;
				}
			}
		}
	}

	.menu2 {
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;

		.order-item {
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}

		image {
			width: 40upx;
			height: 40upx;
			margin-bottom: 20upx;
		}


	}
</style>