<template>
	<view class="previewimage">
		<uni-popup ref="popup">
			<view class="popup-content img">
				<image :src="url" mode="aspectFill"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "PreviewImage",
		data() {
			return {
				url: ""
			};
		},
		mounted() {

		},
		methods: {
			open(url) {
				this.url = url;
				console.log(url)
				this.$refs.popup.open("center");
			}
		},
	}
</script>

<style scoped lang="scss">
	.previewimage {
		.img {
			width: 700upx;
			height: 700upx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>