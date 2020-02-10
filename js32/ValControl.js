		/*
		*这个模块主要完成表单聚焦失焦事件
		*@param id控件id
		*@param validators
		*
		 */
       

		var ValControl=function(id,validators){
			// EventHandler.extend(this,Validator);
			// 深度扩展，把validator对象变成valControl对象的属性值
			this.deepClone= EventHandler.deepClone(Validator);
			
			this.inputCtl = document.querySelector('#'+id);
			this.tip=this.inputCtl.parentNode.lastElementChild;
			this.type=this.inputCtl.type;
			this.name=this.inputCtl.dataset.name;
			this.success=this.inputCtl.dataset.success;
			this.rule=this.inputCtl.dataset.rule;
			this.validators=validators;
			this.inputCtl.addEventListener('focus',this.showMsg());
			this.inputCtl.addEventListener('blur',this.loseFocus());
		}
		ValControl.prototype.showMsg=function(){
		var inputCtl = this.inputCtl;
	    var tip = this.tip;
	    var rule = this.rule;
	    //如果没有return function，那么这里边的this指向的是触发事件的目标
	    return function () {
	        tip.innerText = rule;
	        tip.style.display = 'block';
	        tip.style.color = 'rgba(102,175,233,1)';

	        inputCtl.style.borderColor = 'rgba(102,175,233,1)';
	        inputCtl.style.boxShadow='inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)';
    }
	       
    
		};
		ValControl.prototype.check=function(){
			var data={
				type:this.type,
				value:this.inputCtl.value.trim(),
			};
			var compare = this.inputCtl.dataset.compare;
		    if(compare != undefined){
		 	    var compareValue = document.getElementById(compare).value.trim();
		        data.value = [this.inputCtl.value.trim(), compareValue];
		    }
			var config={
				text:this.name,
				validators:this.validators,
			};
			return message=this.deepClone.validate(data,config);
		};
		ValControl.prototype.getResult = function(){
		    var message = this.check();

		    if(this.deepClone.canBeEmpty(message)){
		        return true;
		    }else{
				var error = !this.deepClone.hasErrors(message);
		        return error;
		    }
	};
		ValControl.prototype.loseFocus=function(){
			var that=this;
			return function(){
				var inputCtl=that.inputCtl;
				var tip=that.tip;
				var message=that.check();
				var canEmpty=that.deepClone.canBeEmpty(message);
				if(canEmpty){
					tip.style.display='none';
					inputCtl.style.borderColor = '#aaa';
            		inputCtl.style.boxShadow='inset 0 1px 1px rgba(0,0,0,.075)';
            		return;
				}
				if(!that.deepClone.hasErrors(message)){
					tip.style.display='block';
					tip.innerText=that.success;
					tip.style.color='rgba(99, 185, 77,1)';
				    inputCtl.style.borderColor = 'rgba(99, 185, 77,1)';
                 inputCtl.style.boxShadow="inset 0 1px 1px rgba(0,0,0,.075)";
				}else{
					tip.style.display='block';
					tip.innerText=message;
					tip.style.color = 'rgba(219, 6, 30,1)';

		            inputCtl.style.borderColor = 'rgba(219, 6, 30,1)';
		            inputCtl.style.boxShadow="inset 0 1px 1px rgba(0,0,0,.075)";
				}
			};
		};