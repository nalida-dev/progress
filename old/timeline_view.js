d3.json(url, function(error, data) {
    if (error) throw error;

    let root = process_data_get_root(data)
    root.eachAfter(node => {
        node.value = 0
        if(node.children) node.children.forEach(child => {node.value += child.value })
        else{
            node.value = node.data.remaining_visible_workload()
        }
    }).sort(function(a, b) { return b.value - a.value; });

    let timeline = d3.select("#timeline_view_svg"),
        width = parseInt(timeline.style("width")),
        height = parseInt(timeline.style("height")),
        timeline_data = root.leaves().map(d => ({
        content: d.data.content,
        duedate: d.data.duedate,
        workload: d.value > 0 ? d.data.remaining_workload() : d.data.workload,
        color: x => get_checked_member().filter(k=>d.data.member.has(k)).length > 0 ? d.color(x) : "transparent",
        depth: d.depth,
        completed: d.value == 0,
        completed_date: d.data.completed_date
        }))

    console.log(timeline_data)


    let x = d3.scaleLinear()
        .domain([moment().subtract(14, 'days'), moment().add(14, 'days')])
        .range([0, width])
    let hour = x(moment().add(1, 'hours')) - x(moment())

    timeline.append("g")
        .attr("class", "xaxis").attr("transform", "translate(0, " + (height - 30) + ")")
        .call(d3.axisBottom(x)
                .tickValues(d3.range(-14,15).map(d=>{
                return moment().hour(0).minute(0).second(0).add(d, 'days')
                }))
                .tickFormat(d => moment(d, "x").format("MM/DD")))
    timeline.selectAll(".xaxis text")
        .attr("transform", function(d){
        return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)"
        })

    let tooltip = timeline.append("g").append("text").style("fill", "transparent")
        .attr("x", width/2).attr("y", 20)

    let current = timeline.append("g").append("line")
        .attr("x1", width/2).attr("y1", 35).attr("x2", width/2).attr("y2", height - 30)
        .style("stroke", "red")


    let circles = timeline.append("g").attr("transform", "translate(0, " + (height - 30) + ")")
        .selectAll("circle").data(timeline_data).enter().append("circle")
        .style("fill", d=>d.color(d.depth))
        .on("mouseover", function(d, i){
            tooltip
            .style("fill", "black")
            .style("text-anchor", "middle")
            .text(d.duedate.format("MM.DD") + " " + d.content.slice(0, 30))
        })
        .on("mouseout", () => {
            tooltip.style("fill", "transparent")
        })

    let original_paint_again = paint_again
    paint_again = () => {
        original_paint_again()
        circles.style("fill", d=>d.color(d.depth))
    }

    let simulation = d3.forceSimulation()
        .nodes(timeline_data)

    timeline_data.forEach(d => {
        d.radius = d.workload * hour * 4
        if(!d.completed) d.x = x(d.duedate) - d.radius
        if(d.completed) d.x = x(d.completed_date) - d.radius
    })

    simulation
        .force("gravity", ()=>{
        for(let tdata of timeline_data){
            if(tdata.y < 0) tdata.vy += 0.3
        }
        })
        .force("collision", d3.forceCollide(d=>d.radius).strength(2))
        .on("tick", () => {
        for(let tdata of timeline_data){
            if(tdata.y + tdata.radius > 0){
            tdata.y = -tdata.radius
            }
            if(tdata.completed){
            if(tdata.x + tdata.radius > x(tdata.completed_date)){
                tdata.x = x(tdata.completed_date) - tdata.radius
            }
            if(tdata.x + tdata.radius > width / 2){
                tdata.x = width / 2 - tdata.radius
            }
            }
            else{
            if(tdata.x + tdata.radius > x(tdata.duedate)){
                tdata.x = x(tdata.duedate) - tdata.radius
            }
            if(tdata.x - tdata.radius < width / 2){
                tdata.x = tdata.radius + width / 2
            }
            }
        }
        circles
            .attr("cx", d=>d.x)
            .attr("cy", d=>d.y)
            .attr("r", d=>d.radius)
        })

        d3.drag()
        .on("start", function(d){
            simulation.restart()
            simulation.alpha(1)
        })
        .on("drag", function(d) {
            d3.select(this)
                .attr("cx", d.x = d3.event.x)
                .attr("cy", d.y = d3.event.y)
        })(circles)

})