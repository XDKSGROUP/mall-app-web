<template>
	<view class="content">
		<view class="order">
			<!-- 订单列表 -->
			<view v-for="(item,index) in list" :key="index" class="li">
				<view class="tt" @click="showOrderDetail(item.id)">
					<text class="id">编号：{{index+1}}</text>
					<text class="date">{{item.createTime}}</text>
				</view>
				<view class="ct">
					<image :src="item.icon" mode="aspectFill" class="img"></image>
					<view class="right">
						<view class="name">
							<text>昵称</text><text>{{item.nickname}}</text>
						</view>
						<view class="username">
							<text>用户名</text><text>{{item.username}}</text>
						</view>
						<view class="phone">
							<text>手机</text><text>{{item.phone}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getInviteList
	} from '@/api/me.js';

	export default {
		data() {
			return {
				form: {
					pageNum: 1,
					pageSize: 15,
				},
				list: [],

			}
		},
		onLoad(option) {
			this.loadData();
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
		methods: {
			loadData(isAppend) {
				const me = this;
				if (isAppend) {
					me.form.pageNum++;
				} else {
					me.form.pageNum = 1;
				}
				getInviteList(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					if (!isAppend) me.list.splice(0, this.list.length);
					me.list.push(...res.data.list);
				});
			},
			showOrderDetail() {},
			deleteOrder() {},
			cancelOrder() {},
			payOrder() {},
			receiveOrder() {},
			calcTotalQuantity() {}
		}
	}
</script>

<style scoped lang="scss">
	.order {
		width: 100%;
	}

	.li {
		width: 700upx;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		background: #fff;
		margin-top: 16upx;

		.tt {
			display: flex;
			align-items: center;
			height: 80upx;
			font-size: $font-base;
			position: relative;
			border-bottom: 1px solid #eee;

			.id {
				flex: 1;
				color: #aaa;
			}

			.date {
				color: #aaa;
			}
		}

		/* 多条商品 */
		.ct {
			height: 160upx;
			padding: 20upx 0;
			display: flex;
			white-space: nowrap;

			.img {
				width: 120upx;
				height: 120upx;
				margin-right: 40upx;
				display: block;
			}

			.right {
				line-height: 44upx;
				font-size: $font-base;
				color:#333;
				flex:1;
				.username{
					color:#999;
				}
				view{
					display: flex;
					justify-content: space-between;
				}
				text {
					display: inline-block;
				}
			}
		}
	}
</style>