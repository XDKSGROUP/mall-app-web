<template>
	<view class="container">
		<div class="img">
			<canvas canvas-id="img" :style="{width:info.canvasW+'px',height:info.canvasH+'px'}"></canvas>
			<canvas canvas-id="qrcode" class="qrcode"></canvas>
		</div>
	</view>
</template>

<script>
	import qrcode from "@/utils/qrcode.js"

	export default {
		data() {
			return {
				info: {
					width: 0,
					height: 0,
					canvasW: 0,
					canvasH: 0,

				}
			};
		},
		onLoad(option) {
			const me = this,
				info = me.info,
				tinfo = uni.getWindowInfo() || {
					windowBottom: 0,
					windowHeight: 838,
					windowTop: 44,
					windowWidth: 400
				};
			info.width = tinfo.windowWidth;
			info.height = tinfo.windowHeight;
			info.canvasW = info.width;
			info.canvasH = info.width * 1650 / 750;
			
			console.log(qrcode)

			this.qrFun("http://localhost:8060/pages/me/invite")
		},
		onReady() {
			this.loadInfo();
		},
		methods: {
			qrFun: function(text) {
				qrcode.make({
					canvasId: 'img', //切记canvasId 里边的内容需要跟canvas里边canvas-id="qrcode"的名字一样
					componentInstance: this,
					text: text, //需要转成二维码的内容是后端传过来的，我这里是onLoad传过来的，根据自己的需要
					size: 150,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: qrcode.errorCorrectLevel.H,
					success: res => {

					}
				})
			},
			/**t:起始位置顶部;l:起始位置左侧；w:显示区域宽度;h:显示区域高度;fs:字体大小;text:文本内容;xp:横向对齐比例;yp:纵向对齐比例*/
			getXY(l, t, w, h, fs, text, xp, yp) {
				const tlen = text.length;
				//计算半角字符数
				const tlens = text.replace(/[\u0391-\uFFE5]/g, "").length;
				//相对左侧、顶部坐标
				const pl = w - (tlen - tlens / 2) * fs,
					pt = h - fs;
				//计算出比例位置
				const x = l + (pl < 0 ? pl : pl * xp);
				const y = t + (pt < 0 ? pt : pt * yp);
				//返回坐标
				return {
					x,
					y
				};
			},
			loadInfo: function() {
				const me = this,
					info = me.info,
					w = info.canvasW,
					h = info.canvasH,
					ctx = uni.createCanvasContext('img', me);

				// 填充背景色，白色
				ctx.beginPath();
				ctx.setFillStyle('#ffffff'); // 默认白色
				ctx.fillRect(0, 0, w, h) // fillRect(x,y,宽度，高度)

				// 绘制背景图
				ctx.drawImage("/static/me/me_bg.jpg", 0, 0, w, h);

				//文字板块
				const textTop = uni.upx2px(370);
				// 等级
				let t = "23",
					f = 12,
					p = me.getXY(0, textTop, uni.upx2px(185), uni.upx2px(44), f, t, 0.5, 0.5);
				ctx.setFontSize(f); // setFontSize() 设置字体字号
				ctx.setFillStyle('#fff'); // setFillStyle() 设置字体颜色
				ctx.fillText(t, p.x, p.y);
				// 荣誉
				t = "12", f = 12,
					p = me.getXY(uni.upx2px(190), textTop, uni.upx2px(184), uni.upx2px(44), f, t, 0.5, 0.5);
				ctx.setFontSize(f) // 字号
				ctx.setFillStyle('#fff') // 颜色
				ctx.fillText(t, p.x, p.y); // （文字，x，y）
				// 人脉值
				t = "9", f = 12,
					p = me.getXY(uni.upx2px(378), textTop, uni.upx2px(184), uni.upx2px(44), f, t, 0.5, 0.5);
				ctx.setFontSize(f) // 字号
				ctx.setFillStyle('#fff') // 颜色
				ctx.fillText(t, p.x, p.y); // （文字，x，y）
				// 团队值
				t = "32", f = 12,
					p = me.getXY(uni.upx2px(560), textTop, uni.upx2px(184), uni.upx2px(44), f, t, 0.5, 0.5);
				ctx.setFontSize(f) // 字号
				ctx.setFillStyle('#fff') // 颜色
				ctx.fillText(t, p.x, p.y); // （文字，x，y）

				// 头像板块
				let photoUrl = "/static/me/user-bg.jpg",
					photoWidth = 375,
					photoHeight = 250,
					photoFixX = 0,
					photoFixY = 0,
					photoMin = 0;
				if (photoWidth > photoHeight) {
					photoMin = photoHeight;
					photoFixX = (photoWidth - photoHeight) / 2;
				} else {
					photoMin = photoWidth;
					photoFixY = (photoHeight - photoWidth) / 2;
				}
				let x = 70,
					y = 82,
					drawX = uni.upx2px(x),
					drawY = uni.upx2px(y),
					drawWidth = uni.upx2px(184),
					radius = drawWidth / 2,
					drawXCircle = drawX + radius,
					drawYdrawY = drawY + radius;
				ctx.save(); //save和restore可以保证样式属性只运用于该段canvas元素
				ctx.strokeStyle = 'white'; //设置边线的颜色
				ctx.lineWidth = 2;
				ctx.beginPath(); //开始路径
				ctx.arc(drawXCircle, drawYdrawY, radius, 0, Math.PI * 2); //画一个整圆.
				ctx.stroke(); //绘制边线
				// 截圆形图
				ctx.save();
				ctx.beginPath();
				ctx.arc(drawXCircle, drawYdrawY, radius, 0, Math.PI * 2);
				ctx.clip();
				//绘图
				ctx.drawImage(photoUrl, photoFixX, photoFixY, photoMin, photoMin, drawX, drawY, drawWidth, drawWidth);
				ctx.restore();

				ctx.draw(true, (ret) => { // draw方法 把以上内容画到 canvas 中。
					uni.showToast({
						icon: 'success',
						mask: true,
						title: '绘制完成',
					});
					uni.canvasToTempFilePath({ // 保存canvas为图片
						canvasId: 'img',
						quality: 1,
						success: (res) => {
							console.log(res);
							this.postDataUrl = res.tempFilePath.replace(/[\r\n]/g,
								'');
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: (res) => {
									uni.hideLoading()
									uni.showToast({
										title: '生成海报成功'
									})
								},
								fail: (res) => {
									uni.hideLoading()
									uni.showToast({
										title: '生成海报失败'
									})
								}
							})
						}
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 750upx;
		height: 1650upx;
		overflow: hidden;

		.img {
			width: 750upx;
			height: 1650upx;
		}

		.qrcode {
			top: 670upx;
			left: 230upx;
			position: absolute
		}
	}
</style>