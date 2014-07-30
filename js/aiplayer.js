function AiPlayer() {

}

//state of the game in a two dimensional array (each element in the two dimensional array represents a column)
//Map 
//0 => up, 1 => right, 2 => down, 3 => left
AiPlayer.prototype.bestMove = function (state, size) {
	var nextStates = [];
	for (var i = 0; i < 4; i++) {
		var copy = this._copyArray(state);
		
		var t = this._move(copy, size, i);
		
		
		
		if (this._sameStates(state, t, size)) {
			continue;
		} else {

			var weight 	  = this._weight1(t,size),
			    //weight1   = this._weight1(t,size),
				d 		  = i,
				count 	  = this._tileCount(t,size),
				mono      = this._monotonicity(t,size),
				cornerMax = this._maxInCorner(t,size),
				c         = (mono * 750) + (cornerMax * 1000) /((weight) + (count*100)); //the constants chosen arbitrarily (still need to be adjusted)
				//c1        = (mono * 750) + (cornerMax * 1000) /((weight1) + (count*100)); 
				//if(c1>c)
				//	c = c1
			nextStates.push({
				favorability: c,
				direction: d,
				corner: cornerMax
				
			});
		}	

	}
	

	var max = nextStates[0];
	for (i = 1; i < nextStates.length; i++) {

		if (nextStates[i].favorability > max.favorability) {
			max = nextStates[i];
		}

	}
	
	return max.direction;
	

	//return this._randRoundoff(Math.random() * 3);
};

AiPlayer.prototype._miniMax = function(state,size,depth,opponent,x,y){
	
	if(depth == this.minMaxDepth){
			return this._favourability(state,size);
		}

	if(!opponent){
		

		for(var i=0;i<4;i++){
			copy = this._copyArray(state,size);
			copy = this._move(copy,size,i);
			x = Math.max(x,this._miniMax(copy,size,depth+1,true,x,y));
		}
 
	}
}else{
	if(depth == this.minMaxDepth){

	}else{
		var emptyPlaces = this._emptyPlaces(state,size);
		forEach(emptyPlaces,function(place){
			state[place[0]][place[1]];
			x = Math.min(x,eval(state));
		}.bind(this));
	}
}

return x;
}

AiPlayer.prototype._emptyPlaces = function(state,size){
	var places;
	for(var i=0; i< size; i++){
		for(var j=0; j< size; j++){
			if (state[i][j]){
				places.push([i,j]);
			}
		}
	}

	return places;

}
AiPlayer.prototype._sameStates = function(state1, state2, size) {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (state1[i][j] != state2[i][j]) {
				return false;
			}
		}
	}

	return true;

};

AiPlayer.prototype._randRoundoff = function (value) {
	return Math.random() < 0.5 ? Math.floor(value) : Math.ceil(value);
};


AiPlayer.prototype._copyArray = function (arr) {
	return arr.map(function (element) {
		return element.slice();
	});

};

AiPlayer.prototype._tileCount = function(arr,size){
	var count = 0;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (arr[i][j]!=null) {
				count+=1;
			}
		}
	}
	return count;
};

AiPlayer.prototype._transposeArray = function (arr, size) {
	var t = [];
	for (var i = 0; i < size; i++) {
		t[i] = [];
		for (var j = 0; j < size; j++) {
			t[i][j] = arr[j][i];
		}
	}
	return t;
};

AiPlayer.prototype._maxInCorner = function(arr,size){
	var max = 0,
	x,
	y;

	for(var i = 0; i < size; i++){
		for(var j = 0; j< size; j++){
			if(arr[i][j] > max){
				max = arr[i][j];
				x = i;
				y = j; 
			}
		}
	}

	if((x==0 || x==size - 1) && (y==0 || y==size - 1)){
		return 1;
	}else{
		return 0;
	}
};

AiPlayer.prototype._monotonicity = function(arr,size){
	
	var mono = 0;

	
	for(var i = 0; i < size; i++ ){

		var  vMaxInc   = 1,
		vStartInc = 0,
		vMaxDec   = 1,
		vStartDec = 0,
		hMaxInc   = 1,
		hStartInc = 0,
		hMaxDec   = 1,
		hStartDec = 0;
		
		for (var j = 1; j < size; j++) {
				//vertical
				if (arr[i][j] >= arr[i][j - 1]) {
					if (j - vStartInc + 1 > vMaxInc) {
						vMaxInc = j - vStartInc + 1;  
					}
				} else {

					vStartInc = j;
				}


				if (arr[i][j] <= arr[i][j - 1]) {
					if (j - vStartDec + 1 > vMaxDec) {
						vMaxDec = j - vStartDec + 1;  
					}
				} else {

					vStartDec = j;
				}


				//Horizontal
				if (arr[j][i] >= arr[j - 1][i]) {
					if (j - hStartInc + 1 > hMaxInc) {
						hMaxInc = j - hStartInc + 1;  
					}
				} else {

					hStartInc = j;
				}


				if (arr[j][i] <= arr[j - 1][i]) {
					if (j - hStartDec + 1 > hMaxDec) {
						hMaxDec = j - hStartDec + 1;  
					}
				} else {

					hStartDec = j;
				}


			}
			//mono+= vMaxDec/size;

			//if(i%2 === 0){
			//	mono+= hMaxInc/size;
			//}else{
			//	mono+= hMaxDec;
			//}

			mono += Math.max(vMaxInc,vMaxDec)/size;
			mono += Math.max(hMaxInc,hMaxDec)/size;
		}


		return mono;

	};

	AiPlayer.prototype._weight = function (arr, size) {
		var weight = 0;
		var offsets = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0,1],
		[1,-1],
		[1,0],
		[1,1]
		];
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				if (arr[i][j] === null) {
					continue;
				}


				for (var x = 0; x < offsets.length; x++) {
					var k = offsets[x][0];
					var l = offsets[x][1];
					if (this._isValidIndex(i+k,size) && this._isValidIndex(j+l,size) && arr[i + k][j + l] !== null) {
						weight += (Math.abs(arr[i][j] - arr[i + k][j + l]));
					}
				}

			}
		}

		return weight;


	};
	
	AiPlayer.prototype._weight1 = function (arr, size) {
		var weight = 0;
		var offsets = [
		[-1, 0],
		[0, -1],
		[0,1],
		[1,0]
		];
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				if (arr[i][j] === null) {
					continue;
				}


				for (var x = 0; x < offsets.length; x++) {
					var k = offsets[x][0];
					var l = offsets[x][1];
					if (this._isValidIndex(i+k,size) && this._isValidIndex(j+l,size) && arr[i + k][j + l] !== null) {
						weight += (Math.abs(arr[i][j] - arr[i + k][j + l]));
					}
				}

			}
		}

		return weight;


	};
	



	AiPlayer.prototype._isValidIndex = function (i, size) {
		if (i >= 0 && i < size) {
			return true;
		} else {

			return false;
		}
	};

	AiPlayer.prototype._move = function (arr, size, direction) {

		if (direction == 3 || direction == 1) {
			arr = this._transposeArray(arr, size);
		}

		if (direction == 2 || direction == 1) {
			arr = arr.map(function (element) {
				return element.reverse();
			});
		}


		for (var i = 0; i < size; i++) {
			arr[i] = this._crunchIdenticalPairs(arr[i], size);
		}


		if (direction == 2 || direction == 1) {
			arr = arr.map(function (element) {
				return element.reverse();
			});
		}

		if (direction == 3 || direction == 1) {
			arr = this._transposeArray(arr, size);
		}

		return arr;
	};


	AiPlayer.prototype._crunchIdenticalPairs = function (arr, size) {
		var i = 0;
		while (i < size - 1) {
			if (arr[i] !== null) {
				if (arr[i] == arr[i + 1]) {
					arr[i] += arr[i + 1];
					arr = this._pullUp(arr, size, i + 1);

				}
				i += 1;

			} else {
				var j = i;
				while (j < size - 1 && arr[i] === null) {
					arr = this._pullUp(arr, size, i);
					j += 1;
				}
				if (j >= size - 1) {
					break;
				}


			}
		}

		return arr;
	};

	AiPlayer.prototype._pullUp = function (arr, size, from) {

		for (var i = from; i < size - 1; i++) {
			arr[i] = arr[i + 1];
		}

		arr[size - 1] = null;

		return arr;

	};