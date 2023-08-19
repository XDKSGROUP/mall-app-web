export const isDev = process.env.NODE_ENV == "development";
const config = {};
if (isDev) {
	config.apiUrl = 'http://192.168.124.88:8085';
} else {
	config.apiUrl = 'https://appweb.pinganhuayu.com.cn';
	//config.apiUrl = 'http://47.110.144.8/apimall';
}
config.apiHttps = /^https/.test(config.apiUrl);
export const baseUrl = "https://app.pinganhuayu.com.cn";
export const apiUrl = config.apiUrl;
export const apiHttps = config.apiHttps;