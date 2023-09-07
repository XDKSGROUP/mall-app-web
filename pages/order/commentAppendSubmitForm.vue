<template>
	<view class="main">
		<view class="product info">
			<view class="cont">
				<image class="img" :src="comment.productPic" mode="aspectFill"></image>
				<view class="right">
					<text class="tt clamp">
						{{comment.productName}}
					</text>
					<text class="attr-box">
						{{comment.productAttribute | formatProductAttr}} x {{comment.productQuantity}}
					</text>
					<text class="price">
						{{comment.productPrice}}
					</text>
				</view>
			</view>
			<view class="form">
				<view class="item" v-if="!isAppend">
					<view class="name">
						综合评价
					</view>
					<view class="input">
						<uni-icons :type="form.star<1?'star':'star-filled'" style="color:#c00;" size="20"
							@click="setStar(1)"></uni-icons>
						<uni-icons :type="form.star<2?'star':'star-filled'" style="color:#c00;" size="20"
							@click="setStar(2)"></uni-icons>
						<uni-icons :type="form.star<3?'star':'star-filled'" style="color:#c00;" size="20"
							@click="setStar(3)"></uni-icons>
						<uni-icons :type="form.star<4?'star':'star-filled'" style="color:#c00;" size="20"
							@click="setStar(4)"></uni-icons>
						<uni-icons :type="form.star<5?'star':'star-filled'" style="color:#c00;" size="20"
							@click="setStar(5)"></uni-icons>
					</view>
				</view>
				<view class="item" style="margin-top:10upx;">
					<textarea v-model="form.addedContent" auto-height placeholder="说说商品的特色和使用感受"
						maxlength="200"></textarea>
				</view>
				<view class="item">
					<view class="pics">
						<UploadImages v-model="form.addedPics" :length="9"></UploadImages>
						<view>添加图片(最多9张)</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit">
			<button form-type="submit" @click="handleSubmit">提交</button>
			<view class="nname" v-if="false">
				<checkbox style="transform:scale(0.6)" value="" @click="setAnonymous" :checked="isAnonymous" />
				<text>匿名评价（您写的评价会以匿名的形式展示）</text>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getInfo,
		setInfoAppend,
	} from '@/api/comment.js';
	import UploadImages from "@/components/l/UploadImages.vue"
	export default {
		components: {
			UploadImages
		},
		data() {
			return {
				comment: {}, //评价信息
				commentId: 0,
				isAppend: 0, //是否为追评
				isAnonymous: false, //是否为匿名
				form: {
					orderItemId: 0,
					star: 0,
					pics: [],
					addedContent: "",
				},
			};
		},
		onLoad(options) {
			this.commentId = options.commentId;
			this.isAppend = options.isAppend;
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
			//获取订单详细
			async loadData() {
				const me = this;
				if (!me.commentId) return;
				getInfo({
					id: me.commentId
				}).then(response => {
					me.comment = response.data;
					me.money = me.comment.payAmount;
					Object.assign(me.form, me.comment, {
						pics: [],
						star: 0,
					});
				});
			},
			//设置星级
			setStar(level) {
				this.form.star = level;
			},
			//设置匿名
			setAnonymous() {
				const me = this;
				me.form.isAnonymous = me.isAnonymous;
			},
			//提交
			async handleSubmit() {
				const me = this;
				if (!me.form.addedContent) {
					me.$api.msg("请填写所有商品的评价内容！");
					return;
				}
				console.log(me.form)
				const res = await setInfoAppend({
					commentId: me.form.id,
					addedContent:me.form.addedContent,
					pics: me.form.pics?.map(x => x.src).join(",") || ""
				});
				if (res.code != 200) {
					me.$api.msg(res.message);
					return;
				}
				me.$api.msg(res.message);
				setTimeout(function() {
					uni.redirectTo({
						url: '/pages/order/commentList'
					})
				}, 3000);
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
			align-items: center;

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

		.form {
			.item {
				font-size: 20upx;
				display: flex;
				align-items: center;

				.name {
					margin-right: 10px;
				}

				.textarea-placeholder {
					font-size: 20upx;
				}
			}

			.star {
				width: 80upx;
				height: 80upx;
			}
		}
	}

	.resume {
		textarea {
			font-size: 20upx;
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

		.nname {
			margin-top: 10upx;
			font-size: 20upx;
			color: #999;
		}
	}
</style>