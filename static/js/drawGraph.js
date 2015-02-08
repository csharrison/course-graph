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

    layout: {
      name: 'cose',
      directed: true,
      roots: '#a',
      padding: 10
    }
  });
  var edges = cy.edges()
  var nodes = cy.nodes()
  var connected = edges.connectedNodes();
  cy.remove(nodes.not(connected));
  console.log('drawing graph');
  var bfs = cy.elements().bfs('#a', function(){}, true);
});
