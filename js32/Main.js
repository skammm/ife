		

	

		function CreateForm(id){
			var createFormBtn = document.querySelector('#'+id+'-create');
			//按钮的点击事件，没有用for循环实现
			createFormBtn.addEventListener('click',function(){
				var test = document.querySelector('#'+id+'-config').value;
				try{
					var testCtl = JSON.parse(test);
				}catch(ex){
					alert('JSON格式错误');
					return;
				}
			
				var formFactory1 = new FormFactory(id+'-factory');
				formFactory1.wapper.innerHTML = "";
				//数组存放ValControl对象
				var testCtls = [];
				for(i in testCtl){
					var ctl = formFactory1.createForm(testCtl[i]);
					
					if(i !== 'submit'){
						testCtls.push(ctl);
					}else{
						ctl.addEventListener('click',function(){
							var result = true;
		                    for(var i =0;i<testCtls.length;i++){
		                    	//循环执行一次聚焦失焦
		                        testCtls[i].inputCtl.focus();
		                        testCtls[i].inputCtl.blur();
		                        result = result && testCtls[i].getResult();
		                    }
		                    if(result){
		                        alert(event.target.dataset.success);
		                    }else{
		                        alert(event.target.dataset.fail);
		                    }
						});
					}
				}
			});
		}
		function init(){
			 CreateForm('form1');
			 CreateForm('form2');
		}
		init();
