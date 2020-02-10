/*-----------------------------【程序说明】-----------------------------
 *	程序说明：	图片爆炸立体效果
 *	浏览器支持：Chrome、Firefox、Safari、国产主流移动浏览器（性能较差）
--------------------
 */
function ParticlesTemplate(){
    var that = this,
		_halfPageWidth = document.body.clientWidth / 2,
		_pageHeigth = document.body.clientHeight,
		img = null,
		cnt = null;

	this.particleCount = 0;
	this.activeCount = 0;

	this.nodes = [];
	this.alives = [];
	this.xs = [];
	this.ys = [];
	this.zs = [];
	this.xvs = [];
	this.yvs = [];
	this.zvs = [];

	this.xa = 0; //x轴方向的加速度
	this.ya = 0.3; //y轴加速度 模仿重力
	this.za = 0.5; //

	this.xf = 0.97; //x axis force
	this.yf = 1; //y axis force
	this.zf = 0.97; //z axis force

	this.timeToStop = false;
	this.transformProperty = false;
	this.vendorPrefix = false;
	this.support3D = false;

    this.init = function(img,wrapper){
		var pwidth = pheight = 20,
		    
			imgWith = wrapper.offsetWidth,
			
            imgHeight = wrapper.offsetHeight,
            nx = Math.floor(imgWith/pwidth),
            ny = Math.floor(imgHeight/pheight),
            div = styleCtn = '';
            // head = document.head || document.getElementsByTagName('head')[0],
            imgCopy=img,
            wrapperCopy = wrapper,
            style = document.querySelector('style');
        style.appendChild(document.createTextNode('.bomb { position: absolute; height: 20px; width: 20px; background-image: url(' + img.src + ');background-size:600px 400px;background-repeat:no-repeat; }'));
        for(var i = 0 , num = nx*ny; i < num ; i++){
            var left = (i%nx)*pwidth;
            var top = Math.floor(i/nx)*pheight;
            styleCtn='left: '+left+'px;top:'+top+'px;background-position:'+(-left)+'px '+(-top)+'px';
            div += '<div class="bomb" style="' + styleCtn + '"></div>';

        }
        wrapper.innerHTML = div;
        var particles = document.getElementsByClassName('bomb'),
			i = particles.length;
		while (i--) {
			this._add(particles[i]);
		}
    }
    var _t = 0;
	this.go = function() {
		if (that.activeCount) {
			if (that.timeToStop) {
				return that.timeToStop = false;
			}
			window.requestAnimationFrame(that.go);				
			that._updateAll();
		} else {			
			that.init(imgCopy, wrapperCopy);
		}
    }
    this._add = function(node) {
		if (!this.transformProperty) {
			var p, properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
			while (p = properties.shift()) {
				if (typeof node.style[p] != 'undefined') {
					this.transformProperty = p;
					if (p != 'transform') {
						this.vendorPrefix = p.replace('Transform', '');
					}
					if (typeof node.style.perspective != 'undefined' || (this.vendorPrefix && typeof node.style[this.vendorPrefix + 'Perspective'] != 'undefined')) {
						this.support3D = true;
					}
					break;
				}
			}
		}
		this.nodes.push(node);
		var i = this.particleCount;
		this._revive(i);
		this.particleCount++;
    }
    this._revive = function(i) {
		this.xs[i] = 0;
		this.ys[i] = 0;
		this.zs[i] = 0;
		var xFactor = (parseInt(this.nodes[i].style.left) - 60) / 40;
		var yFactor = (parseInt(this.nodes[i].style.top) - 95) / 80;
		this.xvs[i] = (10 + Math.floor(Math.random() * 10)) * xFactor;
		this.yvs[i] = (10 + Math.floor(Math.random() * 10)) * yFactor;
		this.zvs[i] = -20 + Math.floor(Math.random() * 40);

		this.activeCount++;
		this.alives[i] = true;
    }
    this._shouldBeKilled = function(i) {
		if (this.xs[i] < -_halfPageWidth || this.xs[i] > _halfPageWidth || this.ys[i] > _pageHeigth || this.zs[i] > 500) {
			this.xs[i] = -9999;
			this.ys[i] = 0;
			this.activeCount--;
			this.alives[i] = false;
		}
	}
	this._updateAll = function() {
		var i = this.particleCount;
		
		while (i--) {
			if (this.alives[i]) {
				this.xvs[i] += this.xa;
				this.yvs[i] += this.ya;
				this.zvs[i] += this.za;

				this.xvs[i] *= this.xf;
				this.yvs[i] *= this.yf;
				this.zvs[i] *= this.zf;

				this.xs[i] += this.xvs[i];
				this.ys[i] += this.yvs[i];
				this.zs[i] += this.zvs[i];

				this._shouldBeKilled(i);

				var s = 1 + this.zs[i] / 200;
				if (s < 0) {
					s = 0;
				}
				if (this.support3D) {
					this.nodes[i].style[this.transformProperty] = 'translate3d(' + this.xs[i] + 'px, ' + this.ys[i] + 'px, ' + this.zs[i] + 'px) rotateX(' + Math.cos(0.1 * this.ys[i]) + 'rad) rotateY(' + Math.sin(0.1 * this.xs[i]) + 'rad)';
				} else {
					this.nodes[i].style[this.transformProperty] = 'translate(' + this.xs[i] + 'px, ' + this.ys[i] + 'px) scale(' + s + ', ' + s + ')';
				}
			}
		}
	}


}