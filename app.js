var App = {};

(function($){

	'use strict';

	$.fn.gameOfLife = function(){
		__gameOfLife(this);
	};

	function __gameOfLife(el){
		App.gameWrapper = $(node.box).appendTo(el);
		App.grid = App.gameWrapper.find('.game-grid');
		App.size = 10;
		App.isReady = true;

		/* Grid */
		App.gridInfo = {
			x: Math.floor(($(document).width()*0.75) / App.size),
			y: Math.floor($(document).height() / App.size)
		};

		App.gameWrapper.find('.game-box').css('width', App.gridInfo.x*App.size+'px');
		App.gameWrapper.find('.game-console').css('width', ($(document).width()-(App.gridInfo.x*App.size))+'px');

		App.data = [];
		for(var i=0;i<App.gridInfo.y;i++){
			App.data[i] = [];
			for(var j=0;j<App.gridInfo.x;j++){
				App.data[i][j] = 0;

				$('<div class="game-item dead"></div>').appendTo(App.grid);
			}
		}


		/* Console */
		App.gameWrapper
			.find('.game-console')
			.append('<h1 class="text-center">Game Of Life</h1>')
			.append('<p class="text-center">Ukuran '+App.gridInfo.x.toString()+'x'+App.gridInfo.y.toString()+'</p>');

		__startEvent();
	}

	function __startEvent(){
		App.grid.children('.game-item').on('click', function(event) {
			event.preventDefault();

			var index = $(this).index();
			var x = index % App.gridInfo.x;
			var y = Math.floor(index / App.gridInfo.x);

			if(App.data[y][x]){
				App.data[y][x] = 0;
				$(this)
					.removeClass('live')
					.addClass('dead');
			}
			else{
				App.data[y][x] = 1;
				$(this)
					.removeClass('dead')
					.addClass('live');
			}
		});

		App.interval = 100;
		App.total = 0;

		App.gameWrapper.find('.game-console').append('<p class="text-center">Generasi '+App.interval/1000+' detik sekali</p>');
		App.gameWrapper.find('.game-console').append('<p class="generate text-center">Total: <span>0</span> Generasi</p>');
		App.gameWrapper.find('.game-console').append('<button id="start">Mulai</button>&nbsp;');
		App.gameWrapper.find('.game-console').append('<button id="generate">Generate</button>&nbsp;');
		App.gameWrapper.find('.game-console').append('<button id="stop">Stop</button>');

		App.gameWrapper.find('.game-console').children('#start').on('click', function(){App.startGeneration()});
		App.gameWrapper.find('.game-console').children('#generate').on('click', function(){App.generate()});
		App.gameWrapper.find('.game-console').children('#stop').on('click', function(){
			App.isReady = false;
			
			setTimeout(function(){
				App.isReady = true;
			}, App.interval*3);
		});
	}

	App.startGeneration = function(){__startGeneration();}

	App.generate = function(){__generate();}

	function __startGeneration(){
		App.generate();
		
		if(App.isReady){
			setTimeout(function(){
				__startGeneration();
			}, App.interval);
		}
	}

	function __generate(){
		App.gameWrapper.find('.generate span').text(++App.total);

		var babies = [];
		var dies = [];

		for(var i=0;i<App.gridInfo.y;i++){
			for(var j=0;j<App.gridInfo.x;j++){
				var total = 0;

				for(var k=0;k<side.length;k++){
					var x = j+side[k][1];
					var y = i+side[k][0];

					if(y>=0 && y<App.data.length){
						if(x>=0 && x<App.data[i].length){
							total += App.data[y][x];
						}
					}
				}

				if(!App.data[i][j]){
					if(total == 3){
						babies.push({i:i,j:j});
					}
				}
				else{
					if(total < 2 || total > 3){
						dies.push({i:i,j:j});
					}
				}
			}
		}

		for(var i=0;i<babies.length;i++){
			var index = babies[i].i*App.gridInfo.x + babies[i].j;
			
			App.data[babies[i].i][babies[i].j] = 1;
			App.grid.children('.game-item').eq(index)
				.removeClass('dead')
				.addClass('live');
		}

		for(var i=0;i<dies.length;i++){
			var index = dies[i].i*App.gridInfo.x + dies[i].j;

			App.data[dies[i].i][dies[i].j] = 0;
			App.grid.children('.game-item').eq(index)
				.removeClass('live')
				.addClass('dead');
		}
	}

	var node = {
		box: '<div class="game-wrapper"><div class="game-box"><div class="game-grid"></div></div><div class="game-console"></div></div>'
	};

	var side = [
		[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]
	];

}(jQuery));