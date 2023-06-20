<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">昵称</text>
			<input class="input" type="text" v-model="form.nickname" placeholder="输入昵称"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">性别</text>
			<picker :value="form.gender" @change="setSex" :range="sexs">
				<input class="input" type="text" v-model="form.genderName" placeholder="选择性别"
					placeholder-class="placeholder" readyonly @focus="hideKeyboard()" />
			</picker>
		</view>
		<view class="row b-b">
			<text class="tit">生日</text>
			<picker mode="date" :value="form.birthday" :start="'1900-01-01'" :end="'2100-01-01'" @change="setBirthday">
				<input class="input" type="text" v-model="form.birthday" placeholder="选择生日" @focus="hideKeyboard()" readyonly
					placeholder-class="placeholder" />
			</picker>
		</view>

		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		rtnDateToStr
	} from '@/utils/com.js';
	import {
		setMemberInfo
	} from '@/api/me.js';

	export default {
		data() {
			return {
				sexs: ['未知', '男', '女'],
				form: {
					nickname: '',
					genderName: '',
					gender: 0,
					birthday: ''
				}
			}
		},
		onLoad(option) {

		},
		onReady() {
			const me = this,
				form = me.form,
				ui = me.userInfo;
			form.nickname = ui.nickname;
			form.gender = ui.gender;
			form.genderName = me.sexs[ui.gender];
			form.birthday = rtnDateToStr(ui.birthday);
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			setBirthday(e) {
				this.form.birthday = e.detail.value;
			},
			setSex(e) {
				this.form.genderName = this.sexs[e.detail.value];
				this.form.gender = e.detail.value;
			},
			//提交
			confirm() {
				const me = this;
				setMemberInfo(me.form).then(res => {
					// if (res.code != 200) {
					// 	me.$api.msg(res.message);
					// }
					me.$api.msg(res.message);
					//更新缓存
					const form = me.form,
						ui = me.userInfo;
					ui.nickname = form.nickname;
					ui.gender = form.gender;
					ui.genderName = me.sexs[form.gender];
					ui.birthday = form.birthday;
					me.login(ui);
					//返回页面
					setTimeout(() => {
						uni.navigateTo({
							url: "/pages/me/set",
							fail(err) {
								console.log(err)
							}
						})
					}, 1500)
				});
			},
			hideKeyboard(){
				uni.hideKeyboard();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>