/**设置时间:enums=[{name:"",value:""}]*/
export function getPickerRange(enums) {
	return enums.map(t => t.name);
}
/**设置时间:enums=[{name:"",value:""}]*/
export function setPicker(obj, valOrValName, args, enums) {
	const o = (obj.value || obj),
		val = args[0].detail.value || 0,
		ks = typeof(valOrValName) == "string" ? [valOrValName] : valOrValName;
	ks.forEach((it, at) => {
		if (!it) return;
		const keys = it.split('.'),
			eo = keys.length - 1;
		for (var i = 0; i < eo; i++) o = o[keys[i]];
		o[keys[eo]] = enums ? enums[val][
			["value", "name"][at]
		] : val;
	})
}
/**切换枚举值，有则删除无则添加:enumValues=number[]*/
export function toggleEnum(enumValues, enumItem) {
	const at = enumValues.findIndex(t => t == enumItem.value);
	if (at > -1) {
		enumValues.splice(at, 1);
	} else {
		enumValues.push(enumItem.value);
	}
}
/**计算最近一周的起始时间*/
export function getLastWeekStartTime() {
	let dt = getLastStartTime(7);
	return dt;
}
/**计算最近一月的起始时间*/
export function getLastMonthStartTime() {
	let dt = getLastStartTime(29);
	return dt;
}
/**计算最近3月的起始时间*/
export function getLast3MonthStartTime() {
	let dt = getLastStartTime(89);
	return dt;
}
/**计算最近num天的起始时间*/
export function getLastStartTime(num) {
	let now = new Date();
	let dt = new Date(now.setDate(now.getDate() - num + 1));
	const month = dt.getMonth() + 1;
	dt = dt.getFullYear() + "-" + (month < 10 ? "0" : "") + month + "-" + (dt.getDate());
	return dt;
}

/**转换返回日期时间*/
export function rtnDateTimeToStr(dt) {
	const dtm = (dt || "").replace(/\.\d+\+\d+\:\d+$/, "").replace("T", " ");
	return dtm;
}
/**转换返回日期*/
export function rtnDateToStr(dt) {
	const dtm = (dt || "").replace(/\s+\d+\:\d+\:\d+$|T\d+\:\d+\:\d+\.\d+\+\d+\:\d+$/, "");
	return dtm;
}
/**返回属性带值的新对象*/
export function getObjByDefinedValues(obj) {
	const rtn = {};
	for (let n in obj) {
		const t = obj[n];
		if (t === undefined || t === null) continue;
		rtn[n] = t;
	}
	return rtn;
}
/**返回错误信息*/
export function getError(msg) {
	return {
		success: false,
		message: msg
	};
}
/**返回结果信息*/
export function getResult(data) {
	return {
		success: true,
		data: data
	};
}
/**获取图片宽高*/
export async function getImageSize(src) {
	if (!src) {
		resolve(getError("图片不能为空"));
	}
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: src,
			success: (image) => {
				resolve(image);
			},
			fail(err) {
				reject(getError(err.message))
			}
		});
	});
}