<template>
	<view class="container">
		<view class="tabs">
			<view class="li" :class="tabIndex==0?'s':''" @click="changeTab(0)">公告</view>
			<view class="hr"></view>
			<view class="li" :class="tabIndex==1?'s':''" @click="changeTab(1)">消息</view>
		</view>
		<view class="message" :class="tabIndex==0?'':'hide'">
			<view class="notice-item" v-for="item in list">
				<text class="time">{{item.publishTime}}</text>
				<view class="content">
					<view class="title">
						<view>{{item.title}}</view>
						<view class="unread" v-if="!item.memberId"></view>
					</view>
					<text class="introduce">
						{{item.intro}}
					</text>
					<view class="bot b-t" @click="navigate('/pages/notice/detail?id='+item.id)">
						<text>查看详情</text>
						<text class="more-icon yticon icon-you"></text>
					</view>
				</view>
			</view>
			<view class="empty" v-if="list.length==0">
				暂无内容
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
		<view class="notice" :class="tabIndex==1?'':'hide'">
			<view class="notice-item" v-for="item in listMsg">
				<text class="time">{{item.publishTime}}</text>
				<view class="content">
					<view class="title">
						<view>{{item.title}}</view>
						<view class="unread" v-if="item.status===0"></view>
					</view>
					<text class="introduce">
						{{item.intro}}
					</text>
					<view class="bot b-t" @click="navigate('/pages/notice/detailMsg?id='+item.id)">
						<text>查看详情</text>
						<text class="more-icon yticon icon-you"></text>
					</view>
				</view>
			</view>
			<view class="empty" v-if="listMsg.length==0">
				暂无内容
			</view>
			<uni-load-more :status="loadingTypeMsg"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {
		getList,
	} from '@/api/notice.js';
	import {
		getList as getListMsg,
	} from '@/api/message.js';
	export default {
		data() {
			return {
				tabIndex: 0,
				loadingType: "more",
				form: {
					id: 0,
					type:1,
					pageNum: 0,
					pageSize: 10,
				},
				list: [],
				loadingTypeMsg: "more",
				formMsg: {
					id: 0,
					pageNum: 0,
					pageSize: 10,
				},
				listMsg: [],
			}
		},
		onShow(options) {
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
			navigate(url) {
				uni.navigateTo({
					url: url
				});
			},
			changeTab(num) {
				this.tabIndex = num;
				this.loadData();				
			},
			/**
			 * 加载数据
			 */
			async loadData(isAppend) {
				const me=this;
				if (me.tabIndex == 0) {
					me.loadDataNotice(isAppend);
				} else {
					me.loadDataMessage(isAppend);
				}
			},
			async loadDataNotice(isAppend) {
				const me = this;
				if (isAppend) {
					me.form.pageNum++;
				} else {
					me.form.pageNum = 1;
				}
				getList(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					const list = res.data.list;
					me.loadingType = list.length < me.form.pageSize ? 'nomore' : 'more';
					if (isAppend) {
						if (list.length == 0) {
							return;
						}
					} else {
						me.list.splice(0, me.list.length);
					}
					//加入列表
					me.list.push(...list);
				});
			},
			async loadDataMessage(isAppend) {
				const me = this;
				if (isAppend) {
					me.formMsg.pageNum++;
				} else {
					me.formMsg.pageNum = 1;
				}
				getListMsg(me.formMsg).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					const list = res.data.list;
					me.loadingTypeMsg = list.length < me.formMsg.pageSize ? 'nomore' : 'more';
					if (isAppend) {
						if (list.length == 0) {
							return;
						}
					} else {
						me.listMsg.splice(0, me.listMsg.length);
					}
					//加入列表
					me.listMsg.push(...list);
				});
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.container {
		padding: 0 0 60px;
	}

	.hide {
		display: none;
	}

	.tabs {
		line-height: 40px;
		background: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
		display: flex;
		justify-content: space-between;


		.li {
			margin: 0 30upx 1px;
			text-align: center;
			flex: 1;
		}

		.hr {
			width: 1px;
			background-color: #f8f8f8;
		}

		.s {
			color: #fa436a;
			border-bottom: 2px solid #fa436a;
		}
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		height: 90upx;
		line-height: 90upx;
		display: flex;
		justify-content: space-between;
		font-size: 32upx;
		color: #303133;
	}

	.unread {
		width: 15upx;
		height: 15upx;
		margin-top: 15upx;
		border-radius: 50%;
		background-color: #fa436a;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}

	.empty {
		text-align: center;
		line-height: 120upx;
	}
</style>