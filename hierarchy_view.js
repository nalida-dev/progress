/*
//var svg = d3.select("#hierarchy_view_svg")
//svg
  //.attr("width", 500)
  //.attr("height", 500)

//var margin = 20,
    //diameter = +svg.attr("width"),
    //g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

//var pack = d3.pack()
    //.size([diameter - margin, diameter - margin])
    //.padding(2);

sheet_id = getParameters('sheet_id')
sheet_name = getParameters('sheet_name')
api_key = getParameters('api_key')
url = "https://sheets.googleapis.com/v4/spreadsheets/" + sheet_id + "/values/" + sheet_name + "?key=" + api_key

//d3.json("nalida.json", function(error, data) {
/*
d3.json(url, function(error, data) {
  if (error) throw error;

  root = process_data_get_root(data)

  root.eachAfter(node => {
      node.value = 0
      if(node.children) node.children.forEach(child => {node.value += child.value })
      else{
        node.value = node.data.remaining_visible_workload()
      }
    })
      .sort(function(a, b) { return b.value - a.value; });

  members = root.data.member
  
  member_checkboxes = d3.select(".members").selectAll("div")
    .data([...members])
    .enter().append("div")
      .style("display", "inline")
      .style("margin-left", "10px")

  member_checkboxes.append("input")
      .attr("type", "checkbox")
      .attr("name", d => d)
      .attr("onclick", "paint_again()")
  member_checkboxes.append("span").text(d=>d)

  get_checked_member = () => {
    ret = [...$("input").filter((i, d)=>$(d).prop("checked")).map((i, d)=>$(d).attr("name"))]
    return ret.length > 0 ? ret : [...members]
  }

  paint_again = () => {
    g.selectAll("circle")
      .style("fill", function(d) { return d.parent && get_checked_member().filter(m => d.data.member.has(m)).length > 0 ? d.color(d.depth) : "transparent"})
  }
  

  let tasks = root.leaves().filter(d=>d.value > 0).sort((a, b)=>{
    return a.data.duedate.format("YYYYMMDD").localeCompare(b.data.duedate.format("YYYYMMDD"))

  })
  task_div = d3.select(".panel").selectAll("div")
    .data(tasks)
    .enter().append("div")
      .style("margin-bottom", "15px")

  task_div.append("div").text((d,i)=> "[" + (i+1) + "] [" + [...d.data.member] + "] " + d.data.duedate.format("YYYY.MM.DD"))
  task_div.append("div").text(d=>d.data.content)

  d3.select(".panel").style("height", "800px").style("overflow-y", "scroll")
  
  var focus = root,
      nodes = pack(root).descendants().filter(d=>d.value > 0),
      view;
    

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function(d) { return d.parent && get_checked_member().filter(m => d.data.member.has(m)).length > 0 ? d.color(d.depth) : "transparent"})
      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .style("font-weight", "bold")
      .style("font-size", d=>d.depth==1?"20px":"15px")
      .text(function(d) { return d.data.content.slice(0,d.depth==1?10:25) + (d.data.content.length > (d.depth==1?10:25) ? "..." : ""); });

  var node = g.selectAll("circle,text");

  svg
      .style("background", "rgb(241,241,241)")
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll(".label")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
});
*/