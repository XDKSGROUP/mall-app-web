<template>
	<input class="input" :value="value" @input="setValue" :placeholder="placeholder" />
</template>

<script>
	export default {
		name: "InputNumber",
		props: {
			value: {
				type: Number,
				default: () => undefined
			},
			placeholder: {
				type: String,
				default: () => undefined
			},
			min: {
				type: Number,
				default: () => undefined
			},
			max: {
				type: Number,
				default: () => undefined
			}
		},
		computed: {

		},
		data() {
			return {

			}
		},
		methods: {
			setValue(e) {
				this.$emit('input', this.getNum(e.detail.value));
			},
			getNum(value) {
				const me = this,
					val = value.replace(/^(\-?\d+\.?\d+).+?$/, "$1");
				let num = parseFloat(val);
				if (me.min !== undefined && num < me.min) num = me.min;
				if (me.max !== undefined && num > me.max) num = me.max;
				
				return num;
			}
		}
	}
</script>

<style scoped>
	.input {
		height: 56upx;
		padding: 0 20upx;
		font-size: 23upx;
		border: 1px solid #ccc;
		border-radius: 10upx;
		display: flex;

		input {
			width: 220upx;
			height: 50upx;
			line-height: 50upx;
			font-size: 23upx;
		}
	}
</style>