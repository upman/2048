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
            nextStates.push({
                weight: this._weight(t,size),
                direction: i,
                count: this._tileCount(t,size)
            });
        }

    }
    copy = this._copyArray(state);
    console.log(JSON.stringify(this._move(copy,size,1)));
    console.log(JSON.stringify(nextStates));

    if(nextStates.length === 0) {
 
        return null;
    } else {
        var min = nextStates[0];
        for (i = 1; i < nextStates.length; i++) {
            if (nextStates[i].count < min.count) {
                min = nextStates[i];
            }
            if(nextStates[i].count == min.count && nextStates[i].weight < min.weight){
            	min = nextStates[i];	
            }

            return min.direction;
        }
    }

    //console.log(JSON.stringify(copy));
    //var w = this._weight(copy,size);
    //console.log(w);
    //this._move(copy,size,2);
    //var a = [2,2,null,8];
    //a = this._crunchIdenticalPairs(a,4);
    //console.log(a);
    //console.log(JSON.stringify(this._move(copy,4,3)));

    //return this._randRoundoff(Math.random() * 3);
};


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
}

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
                if (this._areValidIndices(i + k, j + l, size) && arr[i + k][j + l] !== null) {
                    weight += (Math.abs(arr[i][j] - arr[i + k][j + l]));
                }
            }

        }
    }

    return weight;


};





AiPlayer.prototype._areValidIndices = function (i, j, size) {
    if (i >= 0 && j >= 0 && i < size && j < size) {
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