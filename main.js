let margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  width = 1100 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3
  .select('#treemap')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
// Read data
d3.csv('https://raw.githubusercontent.com/adambabs/visualization/main/test2.csv', function(data) {

  // stratify the data: reformatting for d3.js
  var root = d3
    .stratify()
    .id(function(d) {
      return d.name;
    }) // Name of the entity (column name is name in csv)
    .parentId(function(d) {
      return d.parent;
    })(
      // Name of the parent (column name is parent in csv)
      data
    );

  let tooltip = d3
    .select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px');

  root.sum(function(d) {
    return +d.value;
  }); // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap().size([width, height]).padding(3)(root);
  // use this information to add rectangles:

  svg
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return d.x0;
    })
    .attr('y', function(d) {
      return d.y0;
    })
    .attr('width', function(d) {
      return d.x1 - d.x0;
    })
    .attr('height', function(d) {
      return d.y1 - d.y0;
    })
    .style('stroke', 'black')
    .style('fill', '#00008B')
    .on('mouseover', function() {
      tooltip.style('visibility', 'visible');
    })

    .on('mousemove', function(d) {
      tooltip
        .style('top', d3.event.pageY - 10 + 'px')
        .style('left', d3.event.pageX + 10 + 'px')
        .html(`<b>Number of clones in the class: </b> ${d.data.value/2} <br>
             <b> Code of the class: </b> <br> ${d.data.code}<br>
             <b> Lines at which the clone appears:  </b> ${d.data.lines} <br> `);
    })

    .on('mouseout', function() {

      tooltip
        .style('visibility', 'hidden')
        .text('');
    });

  // and to add the text labels

  svg
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .attr('x', function(d) {
      return d.x0 + 10;
    }) // +10 to adjust position (more right)
    .attr('y', function(d) {
      return d.y0 + 20;
    }) // +20 to adjust position (lower)
    .text(function(d) {
      return d.data.name;
    })
    .attr('font-size', '15px')
    .attr('fill', 'white');
});
