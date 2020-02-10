		/*
		*这个模块主要是完成生成表单的功能，以及返回ValControl对象
		*@param id 获取添加控件的块级元素
		*@returns ValControl对象 
		*/





		var FormFactory = function(id){
			this.wapper=document.querySelector('#'+id);

		};
		FormFactory.prototype.createForm=function(config){
			if(config.type!=='button'){
				return this.createInput(config);
			}else{
				return this.createButton(config);
			}
		};
		FormFactory.prototype.createInput=function(config){
			var div = document.createElement('div');
			div.className='form-group';
			var inputGroup = document.createElement('div');
			inputGroup.className='input-group';
			var input = document.createElement('input');
			input.id=config.id;
			input.type=config.type;
			input.dataset.rule=config.rule;
			input.dataset.success=config.success;
			input.dataset.name=config.label;
			var label = document.createElement('label');
			label.htmlFor=config.id;
			label.innerText=config.label;
			var p = document.createElement('p');
			p.className='info';
			if(config.compare){
		        input.dataset.compare = config.compare;
		    }
			div.appendChild(label);
			div.appendChild(inputGroup);
			inputGroup.appendChild(input);
			inputGroup.appendChild(p);
			this.wapper.appendChild(div);
			var valCtl = new ValControl(config.id);
			
		    valCtl.validators = config.validators;
		    return valCtl;
			};
		FormFactory.prototype.createButton=function(config){
			var div = document.createElement('div');
			div.className='form-group';
			var input = document.createElement('input');
			input.id=config.id;
			input.type=config.type;
			input.value=config.value;
			input.dataset.success=config.success;
			input.dataset.fail=config.fail;

			div.appendChild(input);
			this.wapper.appendChild(div);
			//返回按钮
			return input;
		};

