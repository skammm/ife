		
   

	    /**
	     * 验证数据，确定message的值
	     * @param data
	     * data.type: 数据类型
	     * data.value: 被验证的数据
	     * @param config 验证规则配置
	     * @returns msg 不服从验证规则的参数，如果正确则返回空
	     */


		var Validator={
	  	    types: {},
	    	validate:function(data,config){
	    	var msg, item, validators, validatorItem, checker, result;
	        msg = '';
	        item = config;
	        if(!item){
	            return msg;
	        }
	        validators=item.validators;
	        for(var i=0;i<validators.length;i++){
	        	validatorItem=validators[i];
	        	if(typeof validatorItem==='string'){
	        		checker=this.types[validatorItem];
	        		if(!checker){
                    throw {
                        name: "ValidationError",
                        message: "No handler to validate type " + validators[v]
                    };
                }
	        	}else if(Array.isArray(validatorItem)){
	        		checker=this.types[validatorItem[0]];
	        		 if(!checker){
                    throw {
                        name: "ValidationError",
                        message: "No handler to validate type " + validators[v]
                    };
                }
	        	}
	        	if(Array.isArray(data.value)){
                result = checker.validate.apply(null,data.value);
	            }else{
	                result = checker.validate(data.value);
	            }
	            if(!result){
                var msgType = typeof checker.message;
                if(msgType == 'string'){
                    msg = item.text + checker.message;
                }else if(msgType == 'function'){
                    msg = item.text + checker.message.call(null, validatorItem[1]);
                }
                break;
            }
        }
        return msg;
	        },
	        hasErrors: function(message){
		        return message !== "";
		    },
		    //检查是否可以为空
		    canBeEmpty:function(message){
		        return /可以为空/.test(message);
		    },
	        

	    
	    
		};
		 Validator.types={
		 	isNotEmpty:{
		 		validate:function(value){
		 		return value!=='';
		 	},
		 	message:'不得为空',
		 	},
		 	isEmpty:{
		 		validate:function(value){
		 			return value!=='';
		 		},
		 		message:'可以为空',
		 	},
		 	isNotEqualTo:{
		 		validate:function(value1,value2){
		 			return value1!==value2;
		 		},
		 		message: function(fieldText){
		            return "不得与" + fieldText + "相同，请重新输入 ";
		        },
		 	},
		 	isEqualTo:{
		 		validate:function(value1,value2){
		 			return value1===value2;
		 		},
		 		message: function(fieldText){
		            return "必须与" + fieldText + "相同，请重新输入 ";
		        },
		 	},
		 	isValidName:{
		 		validate:function(value){
		 			var len = value.replace(/[^\x00-\xff]/g,'rr').length;
		 			return len>4&&len<16;
		 		},
		 		message:'长度必须在4到16个字符之间',
		 	},
		 	isValidPassword:{
		 		validate:function(value){
		 			return value.length>8&&value.length<20;
		 		},
		 		message:'长度必须在8--20之间',
		 	},
		 	isValidIdentity: {
		        validate: function(value){
		            return (/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i).test(value);
		        },
        	message: "输入不正确·"
    },

		    isValidDate: {
		        validate: function(value){
		            var t = new Date(value),
		                paddingZero = function(value){
		                    return value < 10 ? ('0' + value) : value;
		                },
		                transStr = [t.getFullYear(), paddingZero(t.getMonth() + 1), paddingZero(t.getDate())].join('-');
		            return transStr === value;
		        },
		        message: '输入不正确'
		    },

		    isValidMobile: {
		        validate: function(value){
		            return (/^0?(13[0-9]|15[012356789]|18[02356789]|14[57])[0-9]{8}$/).test(value);
		        },
		        message: "输入不正确"
		    },

		    isValidEmail: {
		        validate: function(value){
		            return (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(value);
		        },
		        message: "输入不正确！"
		    }

		 	
		 };