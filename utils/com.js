/**设置时间:enums=[{name:"",value:""}]*/
export function setPicker(obj, name, args, enums) {
	const o = (obj.value || obj),
		names = name.split('.'),
		eo = names.length - 1,
		val = args[0].detail.value;
	for (var i = 0; i < eo; i++) o = o[names[i]];
	o[names[eo]] = enums?.find(it => it.value === val).name || val;
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
	const month=dt.getMonth() + 1;
	dt = dt.getFullYear() + "-" + (month<10?"0":"")+month + "-" + (dt.getDate());
	return dt;
}

/**转换返回日期时间*/
export function rtnDateTimeToStr(dt) {
	const dtm=(dt||"").replace(/\.\d+\+\d+\:\d+$/,"").replace("T"," ");
	return dtm;
}
/**转换返回日期*/
export function rtnDateToStr(dt) {
	const dtm=(dt||"").replace(/\s+\d+\:\d+\:\d+$|T\d+\:\d+\:\d+\.\d+\+\d+\:\d+$/,"");
	return dtm;
}