export const isDev = process.env.NODE_ENV == "development";
const config = {};	
if (isDev) {
	config.baseUrl = 'http://192.168.124.88:8085';
} else {
	config.baseUrl = 'http://47.110.144.8/apimall';
	//config.baseUrl = 'http://47.110.144.8/apimall';
}
export const baseUrl=config.baseUrl;