$(function() {
  window.cy = cytoscape({
    container: document.getElementById('graph'),

    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'background-color': '#FA4D70',
          'content': 'data(code)',
          'background-opacity': '.75',
          'shape':'octagon'
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'width': 4,
          'line-color': '#E38576',
          'target-arrow-color': '#E38576',
          'background-opacity': '.5'

        })

      .selector('.highlighted')
        .css({
          'background-color': '#FA4D70',
          'line-color': '#FA4D70',
          'target-arrow-color': '#FA4D70',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': 'inf+s'
        }),

    elements: window.elements['CSCI'],
  });
  var edges = cy.edges()
  var nodes = cy.nodes()
  var connected = edges.connectedNodes();
  cy.remove(nodes.not(connected));

  cy.nodes().forEach(function(element, i, eles) {
    width = element.indegree()*4 + 20;
    element.css('width', width);
    element.css('height', width);
  });

  var valid_colors = ['#D9B48F','#FA4D70','#A19887','#C59B8F','#362B30'];
  cy.nodes().each(function(i,element){
    var data = element.data();
    var num = Math.floor(Math.random() * valid_colors.length);
    element.css('background-color',valid_colors[num]);
  });

  cy.layout({
    name: 'springy',
    animate: true, // whether to show the layout as it's running
    maxSimulationTime: 10000, // max length in ms to run the layout
    ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
    fit: false, // whether to fit the viewport to the graph
    padding: 30, // padding on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    random: false, // whether to use random initial positions
    infinite: true, // overrides all other options for a forces-all-the-time mode
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop

    // springy forces
    stiffness: 400,
    repulsion: 1000,
    damping: 0.5
  });

  cy.on('tap', 'node', {}, function(evt) {
    var node = evt.cyTarget
    var courseCode = $('<p></p>').text(node.data().code);
    var courseTitle = $('<p></p>').text(node.data().title);
    var courseDescription = $('<p></p>').text(node.data().description);

    $('#node_details').html('');
    $('#node_details').append(courseCode);
    $('#node_details').append(courseTitle);
    $('#node_details').append(courseDescription);
  });
});
