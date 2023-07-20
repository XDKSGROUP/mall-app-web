/**弹窗提示*/
export function message(title, image) {
	let icon;
	if (image) {
		icon = image.indexOf(".") < 0 ? image : "none";
		image = undefined;
	} else icon = "none";
	uni.showToast({
		icon: icon,
		title: title,
		image: image,
		duration: 3000
	});
}