<template>
	<view class="main">
		<view class="product info" v-for="(orderItem, itemIndex) in list" :key="itemIndex">
			<view class="title">
				<image class="head" :src="orderItem.memberIcon"></image>
				<view class="r">
					<view class="row">
						<view class="name">{{orderItem.memberNickName}}</view>
						<view class="dt">{{orderItem.createTime}}</view>
					</view>
					<view class="txt">{{orderItem.content}}</view>
					<view class="pics">
						<image :src="it" v-for="(it,at) in orderItem.pics.split(',')" @click="open(it)"></image>
					</view>
				</view>
			</view>
			<view class="append" v-for="(it,at) in orderItem.replayList">
				<view class="dt">{{it.createTime}} <span style="margin-left:20upx;color:#00cc00;">商家回复</span></view>
				<view>
					{{it.content}}
				</view>
			</view>
			<view class="append" v-if="orderItem.addedContent">
				<view class="dt">{{orderItem.addedTime}} <span style="margin-left:20upx;color:#cc0000;">追评</span></view>
				<view>
					{{orderItem.addedContent}}
				</view>
				<view class="pics" v-if="orderItem.addedPics">
					<image :src="it" v-for="(it,at) in (orderItem.addedPics||'').split(',')" @click="open(it)"></image>
				</view>
			</view>
			<view class="cont">
				<image class="img" :src="orderItem.productPic" mode="aspectFill" @click="open(orderItem.productPic)"></image>
				<view class="right">
					<text class="tt clamp">
						{{orderItem.productName}}
					</text>
					<text class="attr-box">
						{{orderItem.productAttribute | formatProductAttr}} x {{orderItem.productQuantity}}
					</text>
					<view class="price">
						金额：<text
							class="pc">{{orderItem.realAmount||orderItem.productPrice*orderItem.productQuantity}}</text>
					</view>
				</view>
			</view>
			<view class="detail">
				<view class="l">
					<view class="look">
						<uni-icons type="eye" size="16"></uni-icons>
						<text>{{orderItem.readCount}}</text>
					</view>
					<view class="comment" v-if="false">
						<uni-icons type="chatbubble" size="16"></uni-icons>
						<text>评论</text>
					</view>
					<view class="like" v-if="false">
						<uni-icons type="hand-up" size="16"></uni-icons>
						<text>点赞</text>
					</view>
				</view>
				<view class="r">
					<view @click="gotoComment(orderItem.id,true)" class="btn" v-if="!orderItem.addedContent">写追评</view>
				</view>
			</view>
		</view>
		<PreviewImage ref="preview"></PreviewImage>
	</view>
</template>
<script>
	import {
		getMyList,
	} from '@/api/comment.js';
	import {
		enumRefundStatus
	} from "@/utils/enums"
	import PreviewImage from '@/components/l/PreviewImage.vue';
	export default {
		components: {
			PreviewImage
		},
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

				getMyList(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
					}

					if (!isAppend) me.list.splice(0, me.list.length);
					me.list.push(...res.data.list);
				});
			},
			//跳转到评价页
			async gotoComment(id, isAppend) {
				uni.navigateTo({
					url: '/pages/order/commentAppendSubmitForm?commentId=' + id + "&isAppend=" + (isAppend ?
						1 : 0)
				});
			},
			async open(url){
				this.$refs.preview.open(url);
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

		.pics {
			display: flex;

			image {
				width: 100upx;
				height: 100upx;
				margin-right: 10upx;
			}
		}
	}

	.product {
		.title {
			line-height: 50upx;
			font-weight: 500;
			align-items: top;

			.head {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
			}

			image {
				width: 100upx;
				height: 100upx;
			}

			.r {
				margin-left: 20upx;
				flex: 1;
			}

			.row {
				display: flex;
				justify-content: space-between;
			}

			.name {
				flex: 1;
				white-space: nowrap;
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
					font-size: $font-sm + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 0;
				}

				.price {
					font-size: $font-sm + 2upx;
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

				.look,
				.comment,
				.like {
					margin-right: 20upx;
				}

				text {
					margin-left: 10upx;
				}
			}

			.btn {
				width: 160upx;
				line-height: 50upx;
				font-size: 20upx;
				text-align: center;
				color: #fff;
				background-color: #d00;
				border-radius: 50upx;
			}
		}
	}
</style>