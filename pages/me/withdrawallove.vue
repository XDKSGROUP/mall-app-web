<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">银行卡</text>
			<picker @change="setBankcardPick" :value="bankCardAt" range-key="name" placeholder="选择银行卡"
				:range="enums.bankCards">
				<view class="uni-input">{{bankCardAt===undefined?"":enums.bankCards[bankCardAt].name}}</view>
			</picker>
		</view>
		<view class="row b-b">
			<text class="tit">爱心值</text>
			<input class="input" type="number" v-model="form.applyMoney" placeholder="输入爱心值"
				placeholder-class="placeholder" />
		</view>

		<button class="add-btn" @click="confirm">提交</button>

		<view class="links">
			<view class="link" @click="gotoList()">查看提现记录</view>
		</view>

	</view>
</template>

<script>
	import {
		getListBankCard,
		addWithdrawalRecord,
		getMeInfo
	} from '@/api/me.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				bankCardAt: undefined,
				enums: {
					bankCards: []
				},
				form: {
					type: 0, //类型：0->爱心值；1->贡献值
					bankCardId: undefined, //银行卡id
					applyMoney: undefined,
				}
			}
		},
		onLoad(option) {
			this.loadBankcard();
		},
		methods: {
			...mapMutations(['login']),
			gotoList() {
				uni.navigateTo({
					url: '/pages/me/withdrawallovelist'
				});
			},
			loadBankcard() {
				const me = this;
				getListBankCard({}).then(res => {
					me.enums.bankCards.splice(0, me.enums.bankCards.length);
					me.enums.bankCards.push(...(res.data || []));
					me.enums.bankCards.forEach((v, i) => {
						v.name = v.bankCardNumber + "(" + v.bankName + ")";
					});
					if (me.enums.bankCards.length){
						me.setBankcardPick({detail:{value:0}});
					} 
				});
			},
			setBankcardPick(e) {
				const me = this,
					val = e.detail.value;
				me.bankCardAt = val;
				me.form.bankCardId = me.enums.bankCards[val].id;
			},
			//提交
			confirm() {
				let me = this;
				if (me.form.bankCardId === undefined) {
					me.$api.msg(`请输银行卡`);
					return;
				}
				if (!me.form.applyMoney) {
					me.$api.msg(`请输入爱心值`);
					return;
				}
				addWithdrawalRecord(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}
					me.$api.msg(`提现申请成功`);
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