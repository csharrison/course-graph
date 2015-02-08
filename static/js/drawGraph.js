console.log('hello world!');

$(function() {
  console.log('on DOM load', document.getElementById('graph'));
  var cy = cytoscape({
    container: document.getElementById('graph'),

    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'background-color': '#362B30',
          'content': 'data(code)'
          
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'width': 7,
          'line-color': '#E38576',
          'target-arrow-color': '#E38576'

        })

      .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '2.0s'
        }),

    elements: window.elements,
  });
  var edges = cy.edges()
  var nodes = cy.nodes()
  var connected = edges.connectedNodes();
  cy.remove(nodes.not(connected));
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
  })
  console.log('drawing graph');
  var bfs = cy.elements().bfs('#a', function(){}, true);
});
