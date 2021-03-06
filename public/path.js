document.getElementById("short").addEventListener("click", findPath);
document.getElementById("quick").addEventListener("click", findPath);

function findPath() {
    if(selectedNodes[0] == parseInt(selectedNodes[0]) && selectedNodes[1] == parseInt(selectedNodes[1])){
	var type = parseInt(this.value);
	var source = selectedNodes[0];
	var target = selectedNodes[1];
	var path = getPath(source, target, type);
	
	//Reset colors
	for(var i=0; i < edges[0].length; i++){
    	    edges[0][i].style.stroke = "brown";
	}
	
	//Highlight path
	for(var i=0; i < path.length-1; i++){
    	    for(var j=0; j < edges[0].length; j++){
    		if(edges[0][j]["__data__"].source.index == path[i] && edges[0][j]["__data__"].target.index == path[i+1]){
    		    edges[0][j].style.stroke = "green";
    		}	
    	    }
	}
	
	//Shortest distance or best time
	if(type == 0)
    	    document.getElementById("result").innerHTML = "Distance = "+best[target];
	else if(type == 1)
    	    document.getElementById("result").innerHTML = "Time = "+best[target].toFixed(3);
    }
}
