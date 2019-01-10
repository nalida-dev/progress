{
    sheet_id = getParameters('sheet_id')
    sheet_name = getParameters('sheet_name')
    api_key = getParameters('api_key')
    url = "https://sheets.googleapis.com/v4/spreadsheets/" + sheet_id + "/values/" + sheet_name + "?key=" + api_key

    let svg = d3.select("#progress_view_svg")
    svg.attr("width", 500).attr("height", 500)

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
        tasks = root.leaves().map(d => ({
            content: d.data.content,
            duedate: d.data.duedate,
            member: d.data.member,
            workload: d.value > 0 ? d.data.remaining_workload() : d.data.workload,
            color: x => d.color(x),
            depth: d.depth,
            completed: d.value == 0,
            completed_date: d.data.completed_date
        }))
        members = root.data.member

        progress = {}
        now = moment()
        tasks.filter(t => t.completed).forEach(task => {
            task.member.forEach(member => {
                if(!(member in progress)){
                    progress[member] = {}
                }
                if(!(task.color() in progress[member])){
                    progress[member][task.color()] = 0
                }
                decay = Math.exp((task.duedate - now) / 86400 / 1000 / 14)
                progress[member][task.color()] += (task.workload / task.member.size) * decay
            })
        });
        console.log(progress)

        let ddata = Object.keys(progress).map(name => {
            return {
                "name": name,
                "value": Object.values(progress[name]).reduce((a,b)=>a+b)
            }
        })

        function translate(x, y){
            return "translate(" + x + ", " + y + ")"
        }

        let margin = 50,
            width = svg.attr("width") - 2 * margin,
            height = svg.attr("height") - 2 * margin
      
        let g = svg.append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", translate(margin, margin))


        let x = d3.scaleBand().domain(ddata.map(d=>d.name)).range([0, width]).padding(0.1),
            y = d3.scaleLinear().domain(d3.extent(ddata.map(d=>d.value))).range([height, 0])

        g.selectAll("rect").data(ddata)
            .enter().append("rect")
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("transform", d => translate(x(d.name), y(d.value)))
            .style("fill", d => "gray")

        let xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y)
        svg.append("g").attr("transform", translate(margin, margin+height)).call(xAxis)
        svg.append("g").attr("transform", translate(margin, margin)).call(yAxis)
    })
}