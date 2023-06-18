<template>
	<view class="content">
		<view class="order">
			<!-- 订单列表 -->
			<view v-for="(item,index) in orderList" :key="index" class="order-item">
				<view class="i-top b-b">
					<text class="time" @click="showOrderDetail(item.id)">{{item.createTime | formatDateTime}}</text>
					<text class="state" :style="{color: '#fa436a'}">{{item.status | formatStatus}}</text>
					<text v-if="item.status===3||item.status===4" class="del-btn yticon icon-iconfontshanchu1"
						@click="deleteOrder(item.id)"></text>
				</view>
				<view class="goods-box-single" v-for="(orderItem, itemIndex) in item.orderItemList" :key="itemIndex">
					<image class="goods-img" :src="orderItem.productPic" mode="aspectFill"></image>
					<view class="right">
						<text class="title clamp">{{orderItem.productName}}</text>
						<text class="attr-box">{{orderItem.productAttr | formatProductAttr}} x
							{{orderItem.productQuantity}}</text>
						<text class="price">{{orderItem.productPrice}}</text>
					</view>
				</view>

				<view class="price-box">
					共
					<text class="num">{{calcTotalQuantity(item)}}</text>
					件商品 实付款
					<text class="price">{{item.payAmount}}</text>
				</view>
				<view class="action-box b-t" v-if="item.status == 0">
					<button class="action-btn" @click="cancelOrder(item.id)">取消订单</button>
					<button class="action-btn recom" @click="payOrder(item.id)">立即付款</button>
				</view>
				<view class="action-box b-t" v-if="item.status == 2">
					<button class="action-btn">查看物流</button>
					<button class="action-btn recom" @click="receiveOrder(item.id)">确认收货</button>
				</view>
				<view class="action-box b-t" v-if="item.status == 3">
					<button class="action-btn recom">评价商品</button>
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

			}
		},
		onLoad(option) {

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
					}

					if (!isAppend) me.list.splice(0, this.list.length);
					me.list.push(...res.data.list);
				});
			},
		}
	}
</script>

<style lang="scss">

</style>