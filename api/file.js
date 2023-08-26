import request from '@/utils/requestUtil'
import {
	formatDate
} from '@/utils/date';
import {
	getError,
	getResult
} from "@/utils/com.js"
import {
	apiHttps
} from '@/utils/config.js'

export async function policy() {
	return request({
		method: 'GET',
		url: '/aliyun/oss/policy?https=' + (apiHttps||""),
	})
}

/**文件上传*/
export async function uploadFile() {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: res => {
				const files = res.tempFiles;
				const file = files[0];
				const formData = {};
				//获取上传权限
				policy().then(response => {
					formData.policy = response.data.policy;
					formData.signature = response.data.signature;
					formData.ossaccessKeyId = response.data.accessKeyId;
					const tname = formatDate(new Date(), "yyyyMMddhhmmss" + Math.round(
						Math.random() * 100000));
					formData.key = response.data.dir + '/' + tname;
					formData.dir = response.data.dir;
					formData.host = response.data.host;
					formData.success_action_status = "200";
					// formData.callback = response.data.callback;
					uni.uploadFile({
						url: formData.host,
						filePath: file.path,
						fileType: file.type,
						name: 'file',
						formData: formData,
						success: res => {
							if (res.statusCode == '200') {
								resolve(getResult(formData.host + "/" +
									formData.key));
							} else {
								reject(getError(res.message));
							}
						}
					});
				}).catch(err => {
					reject(getError(err.message));
				});
			}
		});
	});
}