<template>
	<view class="container">
		<view class="doc">
			<view class="title" v-if="false">关于我们</view>
			<view class="cont">
				<text>
					时隔八年，我把这篇关于我们的内容进行了整理并重新编写。与其说是关于我们，倒不如说是关于我自己，毕竟在网站从搭建到现在一直是我自己一个人在维护运营。在这里也要感谢对网站有帮助的几位朋友。
				</text>
				<text class="tt">
					网站建立初衷
				</text>
				<text>
					互联网的资源是共享，但是共享也存在免费和付费之分。十年前的网络生态非常好，没有太多的付费内容以及现在所流行的各式各样的套路。大多时候，您可以在联网中下载或者阅读到您想或者您需要的资源。在当时论坛很流行的年代，对于一些资源来说您想下载就必须注册或登录。同样，淘宝上也充斥着大量出售的资源。在当时作为一个刚入行的我来说，互联网的新奇与内容使我感觉到分享能让人变得很快乐，我不想去注册，也不想去花费在淘宝上购买一些内容。
				</text>

				<text>
					于是，折腾软件、汉化软件、分享软件就似乎成了我自己喜欢做的事情。
				</text>
				<text>
					在刚开始想要创建网站的时候，自己曾在 QQ 空间发布信息说准备建立自己的网站，也有不少关注我的用户给予支持。那时候居然也有一些人把我自己的 QQ
					号抢先注册为域名。虽然我当时并未公布自己的注册域名，但是多少相对来说也有些遗憾。本来想注册 .com 后缀，可是发现该域名早已有人注册。而当前比较流行 .me 后缀，于是这个域名一直沿用至今。
				</text>
				<text class="tt">
					网站建立发展
				</text>
				<text>
					创建一个网站很简单，现在成熟的网站程序可以让小白很轻松的搭建自己的网站。而如何维护经营好一个网站却又是一件非常考验人恒心的事情。我永远都记得这么一句话：“成功的路上并不拥挤，坚持人的不多而已。”。
				</text>
				<text>
					在网站初期，我一直坚持发布自己汉化的软件，无论是专业的还是一些冷门软件。只要觉得这款软件有点意思，基本上都会考虑把它收入囊中。
				</text>
				<text>
					对于没有接触过汉化的用户来说，汉化可能是件非常神秘且有技术含量的工作。但是对于熟悉汉化的用户来说，可能就体会到重复枯燥的翻译工作了。
				</text>
				<text>
					一款软件少则包含几百、几千条翻译词汇，多则高达上万条词汇。在翻译的内容中还要进行校对。我一般不喜欢批量快速翻译，而多是逐行手动人工翻译校对。汉化的资源文件也是五花八门，有普通文件语言文件、加密文件、标准资源、非标准资源等等。对于一些应用程序还会出现翻译后乱码等情况。
				</text>
				<text>
					汉化是一个可以让你没日没夜的工作，有时候为了汉化软件我多会到凌晨二三点才休息。而如果您想从汉化中获取相应的回报，几乎不太可能。偶尔会碰到一些用户说想要付费翻译某某软件，可是在谈到费用问题时多是没有下文。不过，汉化过这么多软件有些软件还是成功的做成了“爆款”。
				</text>
				<text>
					不管怎样，先做好自己。律人先律已，改变不了别人，就先改变自己。
				</text>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		fetchContent,
	} from '@/api/home.js';
	import {
		formatDate
	} from '@/utils/date';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		data() {
			return {
				info: {
					list: [],
					prms: {
						startTime: undefined,
						endTime: undefined,
						pageNum: 1,
						pageSize: 13
					},
					loadingType: 'more'
				}
			};
		},
		onLoad() {

		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		//加载更多
		onReachBottom() {

		},
		methods: {
			/** 加载数据 */
			async loadData() {

			},
		},
	}
</script>

<style scoped lang="scss">
	.container {
		width: 720upx;
		margin: 20upx auto;
		background: linear-gradient(rgba(255, 255, 255, .06) 20%, #fff 30%);
	}

	.doc {
		width: 750upx;
		line-height: 50upx;
		margin-left: -15upx;
		background: #fff;
		position: relative;

		.title {
			padding: 20upx;
			font-size: 36upx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-bottom: 1px solid #ddd;
		}

		.cont {
			width: 710upx;
			margin: 0 auto;
			padding: 20upx 0;
			font-size: 30upx;
		}

		.tt {
			color: #333;
			text-indent: 0em;
		}
	}

	text {
		padding: 10upx 0;
		text-indent: 2em;
		color: #666;
		display: block;
	}

	span {
		text-indent: 2em;
	}
</style>