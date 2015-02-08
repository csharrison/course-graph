console.log('hello world!');

$(function() {
  console.log('on DOM load', document.getElementById('graph')); 
  var cy = cytoscape({
    container: document.getElementById('graph'),
    
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(id)'
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
      name: 'breadthfirst',
      directed: true,
      roots: '#a',
      padding: 10
    }
  });

  console.log('drawing graph');
  var bfs = cy.elements().bfs('#a', function(){}, true);
});
