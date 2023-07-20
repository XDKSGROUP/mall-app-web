export function setTitleNViewStyle(index,show,text) {  
    let pages = getCurrentPages();  
    let page = pages[pages.length - 1];  
    // #ifdef APP-PLUS  
    let currentWebview = page.$getAppWebview();  
    if(show){  
        if(index === 0){  
            currentWebview.showTitleNViewButtonRedDot({index:index,text:text})  
        }else{  
            currentWebview.setTitleNViewButtonBadge({index:index,text:text})  
        }  
    }else{  
        if(index === 0){  
            currentWebview.hideTitleNViewButtonRedDot({index:index})  
        }else{  
            currentWebview.removeTitleNViewButtonBadge({index:index})  
        }  
    }  
    // #endif

    // #ifdef H5 
	let emt;
    if(show){  
        if(index === 0){ 
			emt=document.querySelectorAll('.uni-page-head-hd .uni-page-head-btn');
            emt&&emt[1].classList.add('uni-page-head-btn-red-dot');  
		} else {
			emt=document.querySelectorAll('.uni-page-head-ft .uni-page-head-btn');
            emt&&emt[index]&&emt[index].classList.add('uni-page-head-btn-red-dot');  
        }  
    } else {  
        if(index === 0){
			emt=document.querySelector('.uni-page-head-btn-red-dot');
            emt&&emt.classList.remove('uni-page-head-btn-red-dot');  
        } else {
			emt=document.querySelector('.uni-page-head-ft .uni-page-head-btn-red-dot');
            emt&&emt.classList.remove('uni-page-head-btn-red-dot');  
        }  
    }  
    // #endif  
}  