<template>
	<view class="lchecklistbox">
		<view class="button" :class="checkList.length?'':'s'" @click="checkAll()" :style="{width:(100/colNum-2)+'%'}">全部</view>
		<view class="button" v-for="(it,key) in list" :key="key" :class="checkList.findIndex(t=>t===it.value)>-1?'s':''"
			@click="toggleEnum(checkList,it)" :style="{width:(100/colNum-2)+'%'}">
			{{it.name}}
		</view>
		<view class="buttonnone" v-for="num in colNum-list.length%colNum-1" :key="num+9999"
			:style="{width:(100/colNum-2)+'%'}"></view>
	</view>
</template>

<script>
	import {
		toggleEnum
	} from '@/utils/com.js';

	export default {
		name: "CheckListBox",
		props: {
			colNum: {
				type: Number,
				default: () => 5
			},
			list: {
				type: Array,
				default: () => []
			},
			value: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			checkList: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val);
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {
			toggleEnum,
			checkAll() {
				this.checkList.splice(0, this.checkList.length);
			}
		}
	}
</script>

<style scoped>
	.lchecklistbox {
		width: 100%;
		line-height: 54upx;
		font-size: 23upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.button {
		height: 56upx;
		margin: 0 0 20upx;
		text-align: center;
		font-size: 23upx;
		color: #333;
		background-color: #f5f5f5;
		border-radius: 10upx;
	}

	.buttonnone {
		width: 22%;
		height: 56upx;
	}

	.button.s {
		color: #fff;
		background-color: #f15d6b;
	}
</style>