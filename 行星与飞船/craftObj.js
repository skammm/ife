                

        (function(window,undefined){
            var SpaceCraft = function(powerSystem, energySystem){
                var that = this;
                this.status = 0;
                this.rotate = systemType.powerType[powerSystem].deg;
                this.consumeEnergy = systemType.powerType[powerSystem].consumeEnergy;
                this.solarEnergy = systemType.energyType[energySystem].solarEnergy;
                this.energy = 100;
                this.destroyed = false;
                this.deg = 0;
                this.removed = false;
                //动力系统
                this.powerSystem = {
                    start :function(){
                       if(that.energy>0){
                        that.status = 1
                       }
                    },
                    stop: function(){
                        that.status = 0
                    },
                    changeDeg:function(){
                        if(that.status === 1) {
                            that.deg += that.rotate;
                        }
                        that.deg = that.deg % 360;
                    }
                    }
                    this.energySystem={
                        solarEnergy:function(){
                           if(that.energy >=100){
                               that.energy = 100;
                           }else{
                            that.energy+=that.solarEnergy;
                           }
                        },
                        consumeEnergy:function(){
                            if(that.status === 1) {
                                that.energy -= that.consumeEnergy;//能量每秒消耗速度
                            }
                            if(that.energy <= 0) {
                                that.status = 0;
                                that.energy = 0;
                            }
                        },
                         //获取当前能源值
                        getCurrentEnergy: function () {
                            return that.energy;
                        }

                    }
                    this.radioSystem = {
                        recevieMessage:function(command){
                            
                            switch(command.command){
                                case 'start':
                                    that.powerSystem.start();
                                    break;
                                case 'stop':
                                    that.powerSystem.stop();
                                    break;
                                case 'destory':
                                    that.destroySystem.destroy();
                            }
                        }
                    };
                    this.destroySystem = {
                        destroy: function () {
                            that.destroyed = true;
                        }
                    };

                }
                window.SpaceCraft = SpaceCraft;
            

        })(window);