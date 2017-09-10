var w = 1000;
var h = 800;

var color = "blue";

var nodes = [];

for(var node in map){
    nodes.push({"name": node});
}

var dataset = {};
dataset.nodes = nodes;
dataset.edges = links;

var selectedNodes = new Array(2);
var sourceTarget = 0;

var svg = d3.select("#graph").append("svg").attr({"width":w,"height":h});

var force = d3.layout.force()
    .nodes(dataset.nodes)
    .links(dataset.edges)
    .size([w,h])
    .linkDistance(function(d){
	return (distance[d.source.index][d.target.index] * 50);    //Set edge length as per distance
    })
    .charge([-15000])
    //.theta(0.1)
    //.gravity(0.05)
    .start();



var edges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .attr("id",function(d,i) {return 'edge'+i})
    .attr('marker-end','url(#arrowhead)')
    .style("stroke","brown")
    .style("pointer-events", "none");

var nodes = svg.selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr({"r":15})
    //.style("fill",function(d,i){return colors(i);})
    .style("fill", color)
    .call(force.drag)


var nodelabels = svg.selectAll(".nodelabel") 
    .data(dataset.nodes)
    .enter()
    .append("text")
    .attr({"x":function(d){return d.x;},
           "y":function(d){return d.y;},
           "class":"nodelabel",
           "stroke":"black"})
    .text(function(d){return d.name;});

var edgepaths = svg.selectAll(".edgepath")
    .data(dataset.edges)
    .enter()
    .append('path')
    .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
           'class':'edgepath',
           'fill-opacity':0,
           'stroke-opacity':0,
           'fill':'blue',
           'stroke':'red',
           'id':function(d,i) {return 'edgepath'+i}})
    .style("pointer-events", "none");

var edgelabels = svg.selectAll(".edgelabel")
    .data(dataset.edges)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attr({'class':'edgelabel',
           'id':function(d,i){return 'edgelabel'+i},
           'dx':80,
           'dy':0,
           'font-size':20,
           'fill':'black'});

edgelabels.append('textPath')
    .attr('xlink:href',function(d,i) {return '#edgepath'+i})
    .style("pointer-events", "none")
    .text(function(d,i){return (distance[d.source.index][d.target.index])});     //Distance between nodes as labels


svg.append('defs').append('marker')
    .attr({'id':'arrowhead',
           'viewBox':'-0 -5 10 10',
           'refX':25,
           'refY':0,
           //'markerUnits':'strokeWidth',
           'orient':'auto',
           'markerWidth':10,
           'markerHeight':10,
           'xoverflow':'visible'})
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'brown')
    .attr('stroke','#ccc');


force.on("tick", function(){

    edges.attr({"x1": function(d){return d.source.x;},
                "y1": function(d){return d.source.y;},
                "x2": function(d){return d.target.x;},
                "y2": function(d){return d.target.y;}
               });

    nodes.attr({"cx":function(d){return d.x;},
                "cy":function(d){return d.y;}
               });

    nodelabels.attr("x", function(d) { return d.x; }) 
        .attr("y", function(d) { return d.y; });

    edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                      return path});       

    edgelabels.attr('transform',function(d,i){
        if (d.target.x<d.source.x){
            bbox = this.getBBox();
            rx = bbox.x+bbox.width/2;
            ry = bbox.y+bbox.height/2;
            return 'rotate(180 '+rx+' '+ry+')';
        }
        else {
            return 'rotate(0)';
        }
    });
});

//Highlight selected nodes
nodes.on('click', function(node) {
    if(sourceTarget == 0){
	if(selectedNodes[0] == parseInt(selectedNodes[0]))
	    nodes[0][selectedNodes[0]].style.fill = "blue";
	selectedNodes[0] = node.index;
	sourceTarget = 1;
	nodes[0][node.index].style.fill = "yellow";
    }
    else if(sourceTarget == 1){
	if(selectedNodes[1] == parseInt(selectedNodes[1]))
	    nodes[0][selectedNodes[1]].style.fill = "blue";
	selectedNodes[1] = node.index;
	sourceTarget = 0;
	nodes[0][node.index].style.fill = "orange";
    }
});
