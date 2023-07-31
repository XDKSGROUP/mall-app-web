<template>
	<view class="doc">
		<view class="cont">
			<rich-text :nodes="info.content"></rich-text>
		</view>
	</view>
</template>

<script>
	import {
		getInfo,
	} from '@/api/help.js';

	export default {
		name:"HelpPage",
		props: {
			id: {
				type: Number,
				default: () => 0
			}
		},
		data() {
			return {
				info: {

				}
			};
		},
		created() {
			this.loadData();
		},
		mounted() {

		},
		methods: {
			/** 加载数据 */
			async loadData() {
				const me = this,
					res = await getInfo({
						id: me.id
					});
				me.info = res.data;
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
