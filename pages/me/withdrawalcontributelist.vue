<template>
	<view class="container">
		<view v-if="isSearch" class="searchpage">
			<view class="li">
				<view class="f">交易时间</view>
				<view class="v">
					<view class="input">
						<picker mode="date" :value="form.applyTimeStart" :start="limits.applyTimeMin"
							:end="limits.applyTimeMax" @change="setDataTimePicker(form,'applyTimeStart',arguments)">
							<view class="pickerin">
								<input placeholder="起始交易时间" :value="form.applyTimeStart" />
								<uni-icons type="bottom" size="10"></uni-icons>
							</view>
						</picker>
					</view>
					<view class="sep"></view>
					<view class="input">
						<picker mode="date" :value="form.applyTimeEnd" :start="form.applyTimeStart||limits.applyTimeMin"
							:end="limits.applyTimeMax" @change="setDataTimePicker(form,'applyTimeEnd',arguments)">
							<view class="pickerin">
								<input placeholder="结束交易时间" :value="form.applyTimeEnd" />
								<uni-icons type="bottom" size="10"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="li">
				<view class="f">变动贡献值</view>
				<view class="v">
					<input class="input" v-model="form.moneyStart" placeholder="最小金额" />
					<view class="sep"></view>
					<input class="input" v-model="form.moneyEnd" placeholder="最大金额" />
				</view>
			</view>
			<view class="btns">
				<view class="reset" @click="reset()">重置</view>
				<view class="confirm" @click="search()">确定</view>
			</view>
		</view>
		<view v-if="!isSearch" class="listpage">
			<view class="search">
				<view class="lasttime" v-for="it in enums.enumLastTimeType" :key="it.value"
					:class="it.value===form.applyTimeType?'s':''" @click="clickLastTime(it)">{{it.name}}
				</view>
				<view class="filter" @click="search()">
					<view>筛选</view>
					<uni-icons type="bottom" size="10"></uni-icons>
				</view>
			</view>
			<view class="list">
				<view class="li" v-for="it in list">
					<view class="act">
						<view class="l">编号：{{it.number}}</view>
						<view class="r">申请：{{it.applyMoney}}贡献值</view>
					</view>
					<view class="dt">
						<view class="l">{{rtnDateTimeToStr(it.applyTime)}}</view>
						<view class="r">状态：{{getStatus(it.status,it.auditStatus)}}</view>
					</view>
					<view class="dt" v-if="it.auditStatus==2">
						原因：{{it.auditReason}}
					</view>
				</view>
				<view class="empty" v-if="list.length==0">
					暂无信息
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		setPicker,
		getLastWeekStartTime,
		getLastMonthStartTime,
		getLast3MonthStartTime,
		rtnDateTimeToStr,
	} from '@/utils/com.js';
	import {
		enumLastTimeType,
		enumWithdrawalStatus,
		enumAuthStatus,
	} from '@/utils/enums.js';
	import InputNumber from '@/components/l/InputNumber.vue';
	import {
		getListWithdrawalRecord
	} from '@/api/me.js';

	export default {
		components: {
			InputNumber
		},
		data() {
			return {
				isSearch: false,
				enums: {
					enumLastTimeType,
				},
				limits: {
					applyTimeMin: '2020-01-01',
					applyTimeMax: '2100-01-01',
				},
				form: {
					type: 1, //贡献值
					applyTimeType: 1,
					applyTimeStart: getLastWeekStartTime(),
					applyTimeEnd: undefined,
					moneyStart: undefined,
					moneyEnd: undefined,
					pageNum: 1,
					pageSize: 15,
				},
				list: [],
			};
		},
		onLoad(option) {
			this.loadData();
			this.formReset = Object.assign({}, this.form);
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData();
			uni.stopPullDownRefresh();
		},
		//加载更多
		onReachBottom() {
			this.loadData(1);
		},
		methods: {
			rtnDateTimeToStr,
			setDataTimePicker(obj, name, args, enums) {
				this.form.applyTimeType = undefined;
				setPicker(obj, name, args, enums);
			},
			getStatus(status, auditStatus) {
				const statusName = enumWithdrawalStatus.find(t => t.value === status)?.name || "-";
				const authStatusName = enumAuthStatus.find(t => t.value === auditStatus)?.name || "-";
				if (status === 0) {
					return authStatusName;
				} else {
					return statusName;
				}
			},
			loadData(isAppend) {
				const me = this;
				if (isAppend) {
					me.form.pageNum++;
				} else {
					me.form.pageNum = 1;
				}
				getListWithdrawalRecord(me.form).then(res => {
					if (res.code != 200) {
						me.$api.msg(res.message);
						return;
					}

					if (!isAppend) me.list.splice(0, me.list.length);
					me.list.push(...res.data.list);
				});
			},
			/** 切换搜索页 */
			search(isOk) {
				const me = this;
				isOk = isOk === undefined ? !me.isSearch : isOk;
				me.isSearch = isOk;
				if (me.form.applyTimeEnd) {
					me.form.applyTimeEnd = isOk ? me.form.applyTimeEnd.replace(/ .*$/, "") : me.form.applyTimeEnd +
						" 23:59:59";
				}
				if (!isOk) me.loadData();
			},
			reset() {
				Object.assign(this.form, this.formReset);
				this.search();
			},
			clickLastTime(item) {
				const me = this;
				me.form.applyTimeType = item.value;
				me.form.applyTimeEnd = undefined;
				switch (item.value) {
					case 1:
						me.form.applyTimeStart = getLastWeekStartTime();
						break;
					case 2:
						me.form.applyTimeStart = getLastMonthStartTime();
						break;
					case 3:
						me.form.applyTimeStart = getLast3MonthStartTime();
						break;
				}
				me.loadData();
			},
			/** 详情页 */
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/me/valuecontributedetail?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		height: calc(100vh - 83upx);

		.searchpage {
			height: 100%;
			padding-top: 30upx;
			position: relative;

			.li {
				padding: 16upx 40upx;
				display: flex;
				flex-direction: column;

				.f {
					line-height: 70upx;
					font-weight: 700;
				}

				.v {
					line-height: 54upx;
					font-size: 23upx;
					display: flex;
					flex-wrap: wrap;
					align-items: flex-start;
					justify-content: space-between;

					.sep {
						height: 27upx;
						line-height: 0;
						margin: 0 40upx;
						flex: 1;
						border-bottom: 1px solid #ccc;
					}

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

					.pickerin {
						display: flex;
					}

					.button {
						width: 23%;
						height: 56upx;
						margin-bottom: 20upx;
						text-align: center;
						font-size: 23upx;
						color: #333;
						background-color: #f5f5f5;
						border-radius: 10upx;
					}

					.button.s {
						color: #fff;
						background-color: #f15d6b;
					}
				}

				.mb_20 {
					margin-bottom: -20upx;
				}

				.max {
					width: 100%;
				}
			}

			.btns {
				width: 100%;
				line-height: 56upx;
				text-align: center;
				bottom: 50upx;
				position: absolute;
				display: flex;

				.reset {
					width: 50%;
					color: #333;
					background-color: #fff;
					border: 1upx solid #ccc;
				}

				.confirm {
					width: 50%;
					color: #fff;
					background-color: #f15d6b;
				}
			}
		}

		.listpage {
			.search {
				height: 100upx;
				background-color: #f5f5f5;
				display: flex;
				justify-content: space-evenly;

				>view {
					width: 20%;
					height: 56upx;
					line-height: 56upx;
					margin: 22upx 0;
					font-size: 23upx;
					text-align: center;
					background: #fff;
					border-radius: 10upx;
				}

				.filter {
					display: flex;
					justify-content: space-around;
				}

				.s {
					color: #fff;
					background: #f15d6b;
				}
			}

			.list {
				width: 690upx;
				margin: 0 auto;

				.li {
					height: 118upx;
					border-bottom: 1upx solid #eee;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					.act {
						font-size: 27upx;
						display: flex;
						justify-content: space-between;

						.l {
							color: #333;
						}

						.r {
							color: #f15d6b
						}
					}

					.dt {
						font-size: 23upx;
						color: #aaa;
						display: flex;
						justify-content: space-between;

						.l {}

						.r {}
					}
				}

				.li:last-child {
					border: 0;
				}

				.empty {
					font-size: 30upx;
					line-height: 130upx;
					text-align: center;
				}
			}
		}
	}
</style>