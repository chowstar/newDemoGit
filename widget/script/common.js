	//判断是否ios
	function isIOS() {
		return api.systemType == "ios";
	}

	// 登出
	var logout = function(type){
		if(type == 'super_trade'){
			var super_trade_uuid = goLogin(type);
			if(super_trade_uuid){
				var toast = showLoading();
				$api.rmStorage('super_trade_uuid');
				$api.rmStorage('super_trade_idcard');
				$api.post(super_trade_app_logout,{
					values: {
						'uuid':super_trade_uuid,
						'IMEI':api.deviceId
					}
				},function(ret,err){
					$api.rmStorage('super_trade_uuid');
					api.sendEvent({
						name: 'reloadHome'
					});
					api.closeToWin({
						name: 'root'
					});
					toast.hide();
				},'json');
			}
		}else{
			var uuid = goLogin();
			if(uuid){
				var toast = showLoading();
				$api.rmStorage('uuid');
				$api.rmStorage('asset_order_idcard');
				$api.post(app_login_out,{
					values: {
						'uuid':uuid,
						'IMEI':api.deviceId
					}
				},function(ret,err){
					$api.rmStorage('uuid');
					api.sendEvent({
						name: 'reloadHome'
					});
					api.closeToWin({
						name: 'root'
					});
					toast.hide();
				},'json');
			}
		}
	}

	function goLogin(type){
		if(type == 'super_trade'){
			var user = $api.getStorage('super_trade_uuid');
		}else{
			var user = $api.getStorage('uuid');
		}
		if(user){
			return user;
		}else{
			 if (api.systemType == "ios") {
				 var times = 0;
			 }else{
				var times = 300;
			 }
			api.openWin({
				name: 'login',
				url: 'widget://html/login/login_head.html',
				delay:times,
				pageParam:{'type':type}
			});
		}
		return false;
	}
	function openWinto(name,url,params){//打开新窗口
		 if (api.systemType == "ios") {
			 var times = 0;
		 }else{
			var times = 0;//var times = 300;
		 }
		api.openWin({
			name: name,
			url: url+'.html',
			delay:times,
			slidBackType:'edge',
			pageParam:params
		});
	}
	function openWin(name,url,param){//打开新窗口并且需要验证登录
		 if (api.systemType == "ios") {
			 var times = 0;
		 }else{
			var times = 300;
		 }
		if(param && param.type == 'super_trade'){
			var user = $api.getStorage('super_trade_uuid');
		}else{
			var user = $api.getStorage('uuid');
		}
		if(!user){
			if (api.systemType == "ios") {
				var times = 0;
			}else{
				var times = 300;
			}
			api.openWin({
				name: 'login',
				url: 'widget://html/login/login_head.html',
				delay:times,
				pageParam:{'type':param.type}
			});
			// 隐藏提示，改为跳转登录页面
			//api.alert({
			//	title: '提示',
			//	msg: '请先登录',
			//	buttons: ['确定']
			//});
			return false;
		}else{
			api.openWin({
				name: name,
				url: url+'.html',
				delay:times,
				slidBackType:'edge',
				pageParam:param
			});
			return false;
		}
	}
	 function showToast(text,location){
		api.toast({
			msg : text,
			location : location
		});
	}
	function openFrame(name,url){//打开一个子窗口,一般用于打开分享页面
		api.openFrame({
			name: name,
			url: url+'.html',
			rect:{
				x: 0,
				y: 0,
			},
			bounces: false
		});
	}
	function call(tel){
		api.call({
			type: 'tel_prompt',
			number: tel
		});
	}

	// 创建验证码
	function createCode() {
		var code = "";
		var codeLength = 4; //验证码的长度
		var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9); //所有候选组成验证码的字符，当然也可以用中文的
		for (var i = 0; i < codeLength; i++)
		{
			var charNum = Math.floor(Math.random() * 10);
			code += codeChars[charNum];
		}
		return code;
	}
	// 验证验证码
	function validateCode(inputCode,code)
	{
		if (inputCode.length <= 0)
		{
			toast("请输入验证码！");
			return false;
		}
		else if (inputCode.toUpperCase() != code.toUpperCase())
		{
			toast("验证码输入有误！");
			createCode();
			return false;
		}
		return true;
	}

	// 显示 loading
	function showLoading(){
		var toast = new auiToast();
		toast.loading({
			title:"加载中",
			duration:2000
		},function(ret){
			setTimeout(function(){
				toast.hide();
			}, 5000)
		});
		return toast;
	}

	// 登录状态验证
	function checkLogin(){
		var uuid = goLogin();
		api.ajax({
			url: app_check,
			method: 'post',
			headers: {'Accept':'application/json'},//,'Content-Type':'application/form-data'
			data: {
				values: {
					uuid: uuid,
					IMEI:api.deviceId
				}
			}
		}, function(ret, err) {
			if (ret) {

			} else {

			}
		});
	}

	// 初始化事件监听
	function initEventListenner() {
		// 拦截Android的返回键，在首页点击返回键，提示退出应用
		api.addEventListener({
			name: 'keyback'
		}, function(ret, err) {
			api.confirm({
				title: '提示',
				msg: '是否退出应用',
				buttons: ['确定', '取消']
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					// 关闭当前的主Widget，就可以实现推出APP的效果
					api.closeWidget({
						silent: true //直接退出，无需提示
					});
				}
			});
		});

		//监听网络连接事件
		api.addEventListener({
			name: 'reloadHome'
		}, function(ret, err) {
			// TODO 事件发生时传递的参数，可能为空
			//if(ret && ret.value){
			//	var value = ret.value;
			//	alert(value.key1 + ' , ' + value.key2);
			//}
			api.execScript({
				name: 'root',
				script: 'setFootActive(0);'
			});
			api.execScript({
				frameName: 'message',
				script: 'apiready();'
			});
			api.execScript({
				frameName: 'me',
				script: 'apiready();'
			});
			api.setFrameGroupIndex({name: 'tab-group',index: 0,reload:true});
		});
	}

	// 时间戳转换时间
	function formatDate(now)   {
		var d = new Date(now);
		var year=d.getFullYear();
		var month=d.getMonth()+1;
		var date=d.getDate();
		var hour=d.getHours();
		var minute=d.getMinutes();
		var second=d.getSeconds();
		if(month<10){
			month="0"+month;
		}
		if(date<10){
			date="0"+date;
		}
		if(hour<10){
			hour="0"+hour;
		}
		if(minute<10){
			minute="0"+minute;
		}
		if(second<10){
			second="0"+second;
		}
		return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
	}
	// 时间戳转换时间
	function formatDate2(now)   {
		var d = new Date(now);
		var year=d.getFullYear();
		var month=d.getMonth()+1;
		var date=d.getDate();
		if(month<10){
			month="0"+month;
		}
		if(date<10){
			date="0"+date;
		}
		return year+"-"+month+"-"+date;
	}

	// 验证手机号
	function validMobile(mobile){
		var myreg = /^(((1[0-9]{1})|(1[0-9]{1})|(1[0-9]{1}))+\d{9})$/;
		if(!myreg.test(mobile))
		{
			return false;
		}
		return true;
	}

	// 星号隐藏手机号码
	function hideMobile(mobile){
		// 匹配手机号首尾，以类似“123****8901”的形式输出
		return mobile.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2');
	}

	// 发送手机验证码
	function sendMessage(type){
		var smsSend_url = smsSend;
		if(type == 'super_trade'){
			smsSend_url = super_trade_app_smsSend;
		}

		var uuid = goLogin(type);
		api.ajax({
			url: smsSend_url,
			method: 'post',
			headers: {'Accept':'application/json'},//,'Content-Type':'application/form-data'
			data: {
				values: {
					uuid: uuid
				}
			}
		}, function(ret, err) {
			if (ret) {
				showToast('短信发送成功');
			} else {

			}
		});
	}
	// 发送手机验证码
	function sendMessage2(mobile,type){
		var smsSend2_url = app_smsSend2;
		if(type == 'super_trade'){
			smsSend2_url = super_trade_app_smsSend2;
		}

		api.ajax({
			url: smsSend2_url,
			method: 'post',
			headers: {'Accept':'application/json'},//,'Content-Type':'application/form-data'
			data: {
				values: {
					mobile: mobile
				}
			}
		}, function(ret, err) {
			if (ret) {
				showToast('短信发送成功');
			} else {
				console.log(JSON.stringify(err));
			}
		});
	}

	function HTMLEncode(html) {
		var temp = document.createElement("div");
		(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
		var output = temp.innerHTML;
		temp = null;
		return output;
	}
	function HTMLDecode(text) {
		var temp = document.createElement("div");
		temp.innerHTML = text;
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	}

	// 打开电子订单协议
	function open_protocol_menu_pdf(){
		var pdfReader = api.require('pdfReader');
		pdfReader.open({
			//path: protocol_menu_pdf,//ios 报错，安卓可以访问 http
			path: 'widget://res/protocol_menu_pdf.pdf'
		});
	}

	// 倒计时
	function countDown(time, fn) {
		var maxtime = (new Date(time) - new Date()) / 1000;//剩余秒

		var timer = setInterval(function () {
			if (maxtime >= 0) {
				var dd = parseInt(maxtime / 60 / 60 / 24, 10);//计算剩余的天数
				var hh = parseInt(maxtime / 60 / 60 % 24, 10);//计算剩余的小时数
				hh  = hh+dd*24;
				var mm = parseInt(maxtime / 60 % 60, 10);//计算剩余的分钟数
				var ss = parseInt(maxtime % 60, 10);//计算剩余的秒数
				hh = checkTime(hh);
				mm = checkTime(mm);
				ss = checkTime(ss);

				//var msg = dd + "天" + hh + "时" + mm + "分" + ss + "秒";
				var msg = hh + "时" + mm + "分" + ss + "秒";
				fn(msg);
				--maxtime;
			}
			else {
				clearInterval(timer);
				fn("已结束");
			}
		}, 1000);
	}
	function checkTime(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	function addEventListener_reloadGetUserInfo(){
		//监听刷新用户信息事件
		api.addEventListener({
			name: 'reloadGetUserInfo'
		}, function(ret, err) {
			getUserInfo();
		});
	}

	function check_has_idcard(type){
		if(!$api.getStorage(type)){
			if(type == "super_trade_idcard"){
				openWin("complete_my_profile_head","../me/complete_my_profile_head",{type:"super_trade"});
				return false;
			}
			openWin("complete_my_profile_head","../me/complete_my_profile_head",{type:"asset_order"});
			return false;
		}
		return true;
	}

	// 检查版本更新
	function checkUpdate() {
		var mam = api.require('mam');
		mam.checkUpdate(function(ret, err) {
			if (ret) {
				var result = ret.result;
				if (result.update == true && result.closed == false) {
					var str = '新版本型号:' + result.version + ';更新提示语:' + result.updateTip + ';下载地址:' + result.source + ';发布时间:' + result.time;
					api.confirm({
						title : '有新的版本,是否下载并安装 ',
						msg : str,
						buttons : ['确定', '取消']
					}, function(ret, err) {
						if (ret.buttonIndex == 1) {
							if (api.systemType == "android") {
								api.download({
									url : result.source,
									report : true
								}, function(ret, err) {
									if (ret && 0 == ret.state) {/* 下载进度 */
										api.toast({
											msg : "正在下载应用" + ret.percent + "%",
											duration : 2000
										});
									}
									if (ret && 1 == ret.state) {/* 下载完成 */
										var savePath = ret.savePath;
										api.installApp({
											appUri : savePath
										});
									}
								});
							}
							if (api.systemType == "ios") {
								api.installApp({
									appUri : result.source
								});
							}
						}
					});
				} else {
					api.alert({
						msg : "暂无更新"
					});
				}
			} else {
				api.alert({
					msg : err.msg
				});
			}
		});
	}
