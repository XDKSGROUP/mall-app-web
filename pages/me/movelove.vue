<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">帐号</text>
			<input class="input" type="text" v-model="form.username" placeholder="输入帐号"
				placeholder-class="placeholder" />
			<view class="link" @click="getInfo" v-if="time<=0">查询</view>
		</view>
		<view class="row b-b">
			<text class="tit">姓名</text>
			<text class="text">{{form.nickname}}</text>
		</view>
		<view class="row b-b">
			<text class="tit">爱心值</text>
			<input class="input" type="number" v-model="form.money" @input="changeMoney('money',arguments)" placeholder="输入爱心值"
				placeholder-class="placeholder" />
		</view>

		<button class="add-btn" @click="confirm">提交</button>

		<view class="links">
			<view class="link" @click="gotoList()">查看传递记录</view>
		</view>

	</view>
</template>

<script>
	import {
		addTransferRecord,
		getMeInfo,
	} from '@/api/me.js';
	import {
		getMemberInfo,
	} from '@/api/member.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				time: 0,
				form: {
					username: "", //用户名
					nickname: "-", //昵称
					type: 0, //类型：0->爱心值；1->贡献值
					transferorMemberId: 0,
					money: undefined,
					receiverMemberId: 0
				}
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad(option) {

		},
		methods: {
			...mapMutations(['login']),
			changeMoney(name,args) {
				const me=this;
				const newValue = args[0].target.value;
				me.$nextTick(()=>{
					me.form[name]=newValue.replace(/[^0-9.]/g,"");
				});
			},
			gotoList() {
				uni.navigateTo({
					url: '/pages/me/movelovelist'
				});
			},
			getInfo() {
				const me = this;
				if (!me.form.username) {
					me.$api.msg(`请输入帐号`);
					return;
				}
				getMemberInfo({
					username: me.form.username
				}).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					if (!res.data) {
						me.$api.msg(`找不到帐号`);
						me.form.nickname = "-";
						return;
					}
					me.form.receiverMemberId = res.data.id;
					me.form.nickname = res.data.nickname;
				});
			},
			//提交
			confirm() {
				let me = this;
				if (!me.form.username || !/^\d{11}$/.test(me.form.username)) {
					me.$api.msg(`请输入帐号`);
					return;
				}
				if (me.form.money=="0") {
					me.$api.msg(`请输入爱心值`);
					return;
				}
				if (parseInt(me.form.money)%100>0) {
					me.$api.msg(`爱心值必须是100的倍数`);
					return;
				}
				addTransferRecord(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg(`传递成功`);
					getMeInfo().then(res => {
						me.login(res.data);
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/me/info"
							})
						}, 1000);
					});
				});
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
	}

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

	.links {
		text-align: center;
	}

	.link {
		color: royalblue;
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