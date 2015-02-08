$(function() {
  var cy = cytoscape({
    container: document.getElementById('graph'),

    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(code)'
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'width': 4,
          'line-color': '#ddd',
          'target-arrow-color': '#ddd'
        })
      .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
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
  var bfs = cy.elements().bfs('#a', function(){}, true);

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
