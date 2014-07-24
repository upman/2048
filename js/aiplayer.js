function AiPlayer(){

}

//Grid objects if moved up, right, down and left
//Map 
//0 => up, 1 => right, 2 => down, 3 => left
AiPlayer.prototype.bestMove = function(movedUp,movedRight,movedDown,movedLeft){
	var roundoff = function(){
		return Math.random()<0.5?Math.floor : Math.ceil;
	}
	
	return roundoff(Math.random()*3);	
};