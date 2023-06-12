<template>
	<div @click="$emit('navigate')" class="scan" :style="'transform: translate('+ x +'px,' + y +'px);'" @touchstart="touchS"
		@touchmove.stop.prevent="touchM" @touchend="touchE">
		<uni-icons class="icon" type="scan" color="#fff" size="30"></uni-icons>
		<slot name="default"></slot>
	</div>
</template>
 
<script>
	export default {
		data() {
			return {
				isC: false,
				start: {
					left: 0,
					top: 0
				},
				x: 0,
				y: 0,
				oldx: 0,
				oldy: 0,
				screenHeight: 667,
				screenWidth: 375
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (res) => {
					this.screenHeight = res.screenHeight - 30;
					this.screenWidth = res.screenWidth - 30;
				}
			});
		},
		methods: {
			touchS(val) {
				this.isMove = true
				this.start.left = val.changedTouches[0].clientX
				this.start.top = val.changedTouches[0].clientY
			},
			touchM(val) {
 
				let clientX = val.changedTouches[0].clientX,
					clientY = val.changedTouches[0].clientY
				clientX = clientX < 30 ? 30 : clientX
				clientX = clientX > this.screenWidth ? this.screenWidth : clientX;
				clientY = clientY < 100 ? 100 : clientY
				clientY = clientY > this.screenHeight ? this.screenHeight : clientY;
				this.x = this.oldx + clientX - this.start.left
				this.y = this.oldy + clientY - this.start.top
 
			},
			touchE(val) {
				// // this.x = this.x < 20 ? 20 : this.x
				this.oldx = this.x
				this.oldy = this.y
				this.isMove = false
			}
 
 
		}
	}
</script>
 
<style>
	.scan {
		position: fixed;
		bottom: 60rpx;
		left: 48%;
		height: 120rpx;
		line-height: 120rpx;
		width: 120rpx;
		border-radius: 50%;
		background-color: #2D64FF;
		text-align: center;
		box-shadow: 0 0 50rpx 0 rgba(0, 0, 0, 0.5);
 
	}
</style>
