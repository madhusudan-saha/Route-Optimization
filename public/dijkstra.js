//var input = {"S":{"T":[5,7],"X":[4,4]},"T":{"X":[3,1],"V":[5,2]},"U":{"S":[7,2],"T":[4,6]},"V":{"U":[4,5]},"X":{"V":[2,1],"W":[5,3]},"W":{"U":[7,5],"S":[8,3]},"Y":{"U":[6,4],"S":[7,2]},"Z":{"T":[2,3],"V":[1,4]}};

var input;
var max = 99999999;
var distance = new Array();
var time = new Array();
var best = new Array();
var visited = new Array();
var prev = new Array();
var path = [];
var links = [];
var map = {};

//Get graph input from server
function getGraph(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/api/graph", false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    input = JSON.parse(xhttp.responseText);
    
    for(var i=0; i < Object.keys(input).length; i++){
    	distance[i] = new Array(Object.keys(input).length);
	time[i] = new Array(Object.keys(input).length);
	for(var j=0; j < Object.keys(input).length; j++){
	    distance[i][j] = time[i][j] = max;
	}
    }
    
    var j = 0;
    for(var node in input){
    	map[node] = j;
    	j++;
    }
    
    for(var node in input){ 
	for(var dest in input[node]){
	    distance[map[node]][map[dest]] = input[node][dest][1];
	    links.push({source: map[node], target: map[dest]});
	    time[map[node]][map[dest]] = input[node][dest][1] / input[node][dest][0];
	}
    }
}

//Dijkstra's Algorithm
function dijkstra(source, type){
    prev[source] = -1;
    for(var i=0; i < Object.keys(input).length; i++){
	best[i] = max;
	visited[i] = 0;
    }

    best[source] = 0;
    
    for(var i=0; i < Object.keys(input).length; i++){
	var min = max;
	var current = 0;
	for(var j=0; j < Object.keys(input).length; j++){
	    if(visited[j] == 0 && best[j] < min){
		current = j;
		min = best[j];
	    }
	}
	visited[current] = 1;
	for(var j=0; j < Object.keys(input).length; j++){
	    if(type == 0){
		if(distance[current][j] < max && best[current] + distance[current][j] < best[j]){
		    best[j] = best[current] + distance[current][j];
		    prev[j] = current;
		}
	    }
	    else if(type == 1){
		if(time[current][j] < max && best[current] + time[current][j] < best[j]){
		    best[j] = best[current] + time[current][j];
		    prev[j] = current;
		}
	    }
	}
    }
}

//Create path array for source and target
function createPath(prev, i){
    if (prev[i] == -1)
        return;

    createPath(prev, prev[i]);
    
    path.push(i);
}

function getPath(source, target, type){
    path = [];
    path.push(source);
    dijkstra(source, type);
    createPath(prev, target);
    return path;
}

getGraph();
