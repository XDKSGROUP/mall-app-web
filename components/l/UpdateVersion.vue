<template>
	<view v-if="!auto" class="lupdateversion" :class="className">
		<!-- #ifdef APP-PLUS -->
		<view class="button" @click="!isUpdate&&checkAndUpdateVersion()">
			{{isUpdate?'更新中...':'更新版本'}}
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import {
		isDev,
		baseUrl
	} from '@/config/host.js'
	import {
		message
	} from '@/utils/message.js'

	export default {
		name: "LUpdateVersion",
		data() {
			return {
				localVersionName: null,
				localVersionCode: null,
				isUpdate: false,
			}
		},
		props: [
			"className", //样式类名
			"auto" //自动更新
		],
		mounted() {
			if (this.auto) this.checkAndUpdateVersion();
		},
		methods: {
			//获取服务器版本号
			/**返回正常值
{
    "code": 200,
    "message": "操作成功",
    "data": {
        "code": 0,
        "msg": "success",
        "version": 100,
        "url": "http://47.110.144.8/app.apk"
    }
}*/
			async getServerVersion() {
				return new Promise((resolve, reject) => {
					console.log(baseUrl + '/home/getVersion?t=' + new Date().getTime())
					uni.request({
						url: baseUrl + '/home/getVersion?t=' + new Date().getTime(), //版本检测
						method: 'POST',
						data: {},
						header: {},
						success: (rst) => {
							isDev && console.log("getServerVersion", rst)
							if (rst.statusCode == 200) resolve(rst.data);
							else reject({
								code: rst.statusCode
							});
						}
					});
				});
			},
			//获取本地版本号
			async getLocalVersion() {
				return new Promise((resolve, reject) => {
					plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
						isDev && console.log("getLocalVersion", widgetInfo)
						if (widgetInfo) resolve(widgetInfo);
						else reject(widgetInfo);
					});
				});
			},
			//下载程序
			async downloadFile(url) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url: url,
						success: (rst) => {
							isDev && console.log("downloadFile", rst)
							rst.code = rst.statusCode;
							if (rst.code == 200) resolve(rst);
							else reject(rst);
						}
					});
				});
			},
			// 检查版本更新
			async checkAndUpdateVersion() {
				const me = this;
				// #ifdef APP-PLUS 
				me.isUpdate = true;
				plus.screen.lockOrientation('portrait-primary') // 竖屏锁定
				const localVersion = await me.getLocalVersion();
				me.localVersionName = localVersion.version;
				me.localVersionCode = parseFloat(localVersion.versionCode + '');
				const serverVersion = await me.getServerVersion();
				if (serverVersion.code !== 0 && serverVersion.code !== 200) {
					message('获取版本信息失败' + serverVersion.message);
					me.isUpdate = false;
					return;
				}
				isDev && console.log(serverVersion.data.version, me.localVersionCode, serverVersion);
				// 如果最新版本大于现在已经安装的App的版本
				if (serverVersion.data.version - me.localVersionCode <= 0) {
					if (!me.auto) {
						message('当前已是最新版本V' + me.localVersionName);
					}
					me.isUpdate = false;
					return;
				}
				uni.showModal({
					title: "更新提示",
					content: "发现新版本,请确认下载更新?",
					success: async (res) => {
						if (!res.confirm) {
							message('已取消下载更新');
							me.isUpdate = false;
							return;
						}
						uni.showLoading({
							title: '更新中...'
						});
						const rst = await me.downloadFile(serverVersion.data.url);
						if (rst.code !== 0 && rst.code !== 200) {
							message('下载失败', 'error');
							me.isUpdate = false;
							return;
						}
						uni.hideLoading();
						me.isUpdate = false;
						plus.runtime.install(
							rst.tempFilePath, {
								force: true
							},
							function() {
								message('App安装成功', 'success');
								plus.runtime.restart();
							},
							function(e) {
								message('App安装失败', 'error');
								console.log('App安装失败', e);
							}
						)
					}
				});
				// #endif
			},
		},
	}
</script>

<style>
	.updateversion {
		width: 100%;
		/* overflow: hidden; */
	}
</style>