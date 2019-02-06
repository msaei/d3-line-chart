const margin = { top: 40, right: 20, bottom: 50, left: 100 };
const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 560)
    .attr('height', 400)

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// scales
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// axes group
const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis')

//d3 line path genarator
const line = d3.line()
    .x(function(d) { return x(new Date(d.date)) })
    .y(function(d) { return y(d.amount) });
// line path element
const path = graph.append('path');

//create dotted line group and append to graph
const dottedLines = graph.append('g')
    .attr('class', 'lines')
    .style('opacity', 0);

//crate x doted line and append to dotted line
const xDottedLine = dottedLines.append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 4);
//crate y doted line and append to dotted line
const xDottedLine = dottedLines.append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 4);


// update graph with realtime data
const update = (data) => {
    // filter data depends on activity selected
    data = data.filter(item => item.activity == activity)
        // sort data acording to date
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    // set scale domaind
    x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain([0, d3.max(data, d => d.amount)]);

    //update path element
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('d', line)
        // create circles
    const circles = graph.selectAll('circle')
        .data(data)

    //update current points
    circles
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.amount))
        //remove deleted points
    circles.exit().remove()
        // add new points
    circles.enter()
        .append('circle')
        .attr('r', 4)
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.amount))
        .attr('fill', '#ccc');
    graph.selectAll('circle')
        .on('mouseover', (d, i, n) => {
            d3.select(n[i])
                .transition().duration(200)
                .attr('r', 8)
                .attr('fill', '#fff')
        })
        .on('mouseleave', (d, i, n) => {
            d3.select(n[i])
                .transition().duration(200)
                .attr('r', 4)
                .attr('fill', '#ccc')
        })

    // create axis
    const xAxis = d3.axisBottom(x)
        .ticks(4)
        .tickFormat(d3.timeFormat('%b %d'));
    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d + 'm')

    // call axis
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    // rotate xAxis test
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
}

// data and firestore
var data = [];

db.collection('activity').onSnapshot(res => {
    res.docChanges().forEach(change => {
        const doc = {...change.doc.data(), id: change.doc.id };
        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id != doc.id);
                break;
            default:
                break;
        }
    })
    update(data);
})