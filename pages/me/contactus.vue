<template>
	<view class="container">
		<HelpPage :id="1"></HelpPage>
	</view>
</template>

<script>
	import {
		getInfo,
	} from '@/api/help.js';
	import HelpPage from "@/components/l/HelpPage.vue"

	export default {
		components:{
			HelpPage
		},
		data() {
			return {

			};
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style scoped>

</style>