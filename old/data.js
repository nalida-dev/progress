let __TASK_ID_CNT__ = 0
function Task(content, duedate, member, project, workload, completed, completed_date){
  this.id = __TASK_ID_CNT__++
  this.content = (d => {
    return d == "" ? "내용 없음" : d
  })(content)
  this.duedate = (d => {
    return d.split('.').length == 3 ? 
      moment(d, "YYYY.MM.DD").add(12, 'hours') : 
      moment().add(21, 'days')
  })(duedate)
  this.member = (d => {
    if(typeof d == "string"){
      return ["", "모두", "전원", "전부"].includes(d) ?
        ["__ALL__"] : 
        d.split(",").map(s=>s.trim())
    }
    else return d // d might be new Set()
  })(member)
  this.project = project
  this.workload = (d => {
    return d == "" ? 2 : parseInt(d)
  })(workload)
  this.completion_rate = (d => {
    d_int = parseInt(d)
    if(!isNaN(d_int)) return Math.min(Math.max(d_int, 0), 100)
    if(d.length > 0) return 100
    return 0
  })(completed)
  this.completed_date = (d => {
    return d.split('.').length == 3 ? 
      moment(d, "YYYY.MM.DD hh:mm aa") : 
      moment().add(21, 'days')
  })(completed_date)

  this.is_completed = function(){ return this.completion_rate == 100 }
  this.remaining_workload = function(){
    return this.workload * (100 - this.completion_rate) / 100
  }
  this.remaining_visible_workload = function(){
    return this.remaining_workload() / Math.max(0.25, (this.duedate - moment())/86400000)
  }
}

function fix_member(tasks){
  let members = []
  tasks.forEach(task => task.member.forEach(m => m=="__ALL__" ? null : members.push(m)))
  members = new Set(members)
  tasks.forEach(task => {
    task.member = task.member.includes("__ALL__") ? members : new Set(task.member)
  })
}

function construct_hierarchy(tasks){
  //(content, duedate, member, project, workload, completed)
  tasks.forEach(task => {
    if(task.project == "") task.project = "__ROOT__"
  })
  let names = [["__ROOT__", ""]]
  tasks.map(task => task.project).forEach(project => {
    args = project.split(':')
    for(let i=0;i<args.length;i++){
      let me = args.slice(0, i+1).join(':')
      let parent = args.slice(0, i).join(':')
      parent = (parent == "" ? "__ROOT__" : parent)
      names.push([me, parent])
    }
  })
  names = [... new Set(names.map(d => JSON.stringify(d)))].map(d => JSON.parse(d))
  names.forEach(me_and_parent => {
      tasks.push(new Task(me_and_parent[0], "", new Set(), me_and_parent[1], "", "", ""))
  })

  root = d3.stratify()
    .id(d => d.id)
    .parentId(d => {
      for(let task of tasks){
        if(task.content == d.project) return task.id
      }
      return undefined
    })(tasks)

  root.eachAfter(node => {
    if(node.children) {
      node.children.forEach(child=>{
        node.data.member = new Set([...node.data.member, ...child.data.member])
      })
    }
  })

  let colorScale = (h) => { 
    return d3.scaleLinear()
      .domain([0 , 5])
      .range(["hsla("+h+",100%,60%,0)", "hsla("+h+",100%,60%,1)"])
      .interpolate(d3.interpolateHcl);
  }
  let simple_hash = (s, base=199) => {
    ret = 0
    for(let i=0;i<s.length;i++){
      ret *= base
      ret += s.charCodeAt(i) % base
    }
    return ret
  }
  root.children.map((node, ind) => {
    let h = simple_hash(node.data.content) % 360
    let color = colorScale(h)
    node.each(node => node.color = color)
  })

  return root
}

function get_tasks(data){
  let tasks = data.values.slice(2).filter(row => row.join('').length > 0).map((row, ind) => {
    row = row.slice(0, 7); while(row.length < 7) row.push("")
    return new Task(...row)
  })
  fix_member(tasks)
  return tasks
}

function process_data_get_root(data){
  let tasks = data.values.slice(2).filter(row => row.join('').length > 0).map((row, ind) => {
    row = row.slice(0, 7); while(row.length < 7) row.push("")
    return new Task(...row)
  })
  fix_member(tasks)
  root = construct_hierarchy(tasks)

  return root
}