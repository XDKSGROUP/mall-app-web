<template>
	<view class="main">
		<view class="tabs">
			<view class="tag" :class="{s:tagAt==0}" @click="searchTagAt(0)">全部({{total[0]}})</view>
			<view class="tag" :class="{s:tagAt==3}" @click="searchTagAt(3)">最新</view>
			<view class="tag" v-if="false">有图(200)</view>
			<view class="tag" :class="{s:tagAt==2}" @click="searchTagAt(2)">追加</view>
		</view>
		<view class="product info" v-for="(it, at) in list" :key="at">
			<view class="title">
				<image :src="it.memberIcon"></image>
				<view class="r">
					<view class="name">{{it.memberNickName}}</view>
					<view class="dt">{{it.createTime}}</view>
					<view class="txt">{{it.productAttribute|formatProductAttr}}<b style="color:#c00;"> x
						</b>{{it.productQuantity}}</view>
				</view>
			</view>
			<view class="append">
				<view class="txt">{{it.content}}</view>
				<view class="imgs" v-if="it.pics">
					<image v-for="(o,i) in it.pics.split(',')" :src="o"></image>
				</view>
				<view class="dt">{{it.addedTime}} <span style="color:#c00;margin-left:10px;">追评</span></view>
				<view class="txt">{{it.addedContent}}</view>
				<view class="imgs" v-if="it.addedPics">
					<image v-for="(o,i) in it.addedPics.split(',')" :src="o"></image>
				</view>
			</view>
			<view class="append" v-for="(o,i) in it.replayList">
				<view class="dt">{{o.createTime}} <span style="margin-left:20upx;color:#00cc00;">商家回复</span></view>
				<view>
					{{o.content}}
				</view>
			</view>
			<view class="detail" v-if="false">
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
		<!-- 底部操作菜单 -->
		<view class="page-bottom" v-if="false">
			<view class="left">
				<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
					<text class="yticon icon-xiatubiao--copy"></text>
					<text>首页</text>
				</navigator>
				<navigator url="/pages/cart/cart" open-type="switchTab" class="cart p-b-btn">
					<text class="yticon icon-gouwuche"></text>
					<text>购物车</text>
					<text class="cartnum" v-if="cartNum>0">{{cartNum}}</text>
				</navigator>
				<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
					<text class="yticon icon-shoucang"></text>
					<text>收藏</text>
				</view>
			</view>
			<view class="action-btn-group">
				<!-- <button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button> -->
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addToCart">加入购物车</button>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex';
	import {
		fetchProductDetail
	} from '@/api/product.js';
	import {
		addCartItem,
		getCartNum
	} from '@/api/cart.js';
	import {
		createProductCollection,
		deleteProductCollection,
		productCollectionDetail
	} from '@/api/memberProductCollection.js';

	import {
		getList,
	} from '@/api/comment.js';
	export default {
		data() {
			return {
				product: {},
				skuStockList: [],
				favorite: false,
				cartNum:0,

				tagAt: 0,
				total: [0, 0, 0, 0],
				list: [],
				form: {
					productId: 0,
					pageNum: 1,
					pageSize: 15,
					orderBy: "id asc",
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
			this.form.productId = options.id;
			this.loadProduct(this.form.productId);
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
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			async searchTagAt(tagAt) {
				this.tagAt = tagAt;
				Object.assign(this.form, {
					type: tagAt == 2 ? 2 : null,
					orderBy: tagAt == 0 ? "id asc" : tagAt == 3 ? "id desc" : undefined
				});
				this.loadData();
			},
			//获取订单详细
			async loadData(isAppend) {
				const me = this;
				if (isAppend) {
					me.form.pageNum++;
				} else {
					me.form.pageNum = 1;
				}

				getList(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
					}
					me.total[me.tagAt] = res.data.total;
					me.total=[...me.total];
					if (!isAppend) me.list.splice(0, me.list.length);
					me.list.push(...res.data.list);
				});
			},
			//获取当前选中商品的SKU
			getSkuStock() {
				for (let i = 0; i < this.skuStockList.length; i++) {
					let spDataArr = JSON.parse(this.skuStockList[i].spData);
					let availAbleSpecSet = new Map();
					for (let j = 0; j < spDataArr.length; j++) {
						availAbleSpecSet.set(spDataArr[j].key, spDataArr[j].value);
					}
					let correctCount = 0;
					for (let item of this.specSelected) {
						let value = availAbleSpecSet.get(item.pname);
						if (value != null && value == item.name) {
							correctCount++;
						}
					}
					if (correctCount == this.specSelected.length) {
						return this.skuStockList[i];
					}
				}
				return null;
			},
			async loadProduct(id) {
				const me = this;
				fetchProductDetail(id).then(response => {
					const data = response.data;
					me.product = data.product;
					me.skuStockList = data.skuStockList;
				});
			},
			async loadCartNum() {
				const me = this;
				getCartNum().then(res => {
					me.cartNum = res.data || 0;
				});
			},
			//将商品加入到购物车
			addToCart() {
				if (!this.checkForLogin()) {
					return;
				}
				const me = this;
				let productSkuStock = this.getSkuStock() || {};
				let cartItem = {
					price: this.product.price,
					productAttr: productSkuStock.spData,
					productBrand: this.product.brandName,
					productCategoryId: this.product.productCategoryId,
					productId: this.product.id,
					productName: this.product.name,
					productPic: this.product.pic,
					productSkuCode: productSkuStock.skuCode,
					productSkuId: productSkuStock.id,
					productSn: this.product.productSn,
					productSubTitle: this.product.subTitle,
					isSpecific: this.product.isSpecific,
					quantity: 1
				};
				addCartItem(cartItem).then(response => {
					me.loadCartNum();
					message(response.message);
				});
			},
			//检查登录状态并弹出登录框
			checkForLogin() {
				if (!this.hasLogin) {
					uni.showModal({
						title: '提示',
						content: '你还没登录，是否要登录？',
						confirmText: '去登录',
						cancelText: '取消',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/public/login'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return false;
				} else {
					return true;
				}
			},
			//收藏
			toFavorite() {
				if (!this.checkForLogin()) {
					return;
				}
				if (this.favorite) {
					//取消收藏
					deleteProductCollection({
						productId: this.product.id
					}).then(response => {
						message("取消收藏成功！");
						this.favorite = !this.favorite;
					});
				} else {
					//收藏
					let productCollection = {
						productId: this.product.id,
						productName: this.product.name,
						productPic: this.product.pic,
						productPrice: this.product.price,
						productSubTitle: this.product.subTitle
					}
					createProductCollection(productCollection).then(response => {
						message("收藏成功！");
						this.favorite = !this.favorite;
					});
				}
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.main {
		padding-bottom: 70upx;
	}

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

				.txt {
					width: 100%;
				}
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

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.left {
			display: flex;
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
			margin-right: 20upx;
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
</style>