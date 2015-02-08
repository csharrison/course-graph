$(function() {

  function fillDetails(evt) {
    var node = evt.cyTarget
    var courseCode = $('<p></p>').text(node.data().code);
    var courseTitle = $('<p></p>').text(node.data().title);
    var iHaveTaken = $("<input type='checkbox'>I've taken this class<br>");
    var courseDescription = $('<p></p>').text(node.data().description);

    if (localStorage[node.data().id]) {
      iHaveTaken.prop('checked', true);
    }
    iHaveTaken.bind('change', function(){
      if (iHaveTaken.prop('checked')) {
        node.css('background-color', 'green');
        localStorage[node.data().id] = true;
      } else {
        node.css('background-color', node.data().color);
        localStorage[node.data().id] = false;
      }
    });
    $('#node_details').html('');
    $('#node_details').append(courseCode);
    $("#node_details").append(iHaveTaken);
    $('#node_details').append(courseTitle);
    $('#node_details').append(courseDescription);
  }

  function reset(dep) {
    window.dep = dep;
    document.title = dep+ "@Brown";
    $("#node_details").html('');
    window.cy = cytoscape({
      container: document.getElementById('graph'),

      style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'background-color': '#FA4D70',
            'content': 'data(number)',
            'text-outline-color' : 'white',
            'text-outline-width' : '.5px',
            'font-weight': 'bold',
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

      elements: window.elements[dep],
    });
    var nodes = cy.nodes()
    var no_connections = $("#no_connections");
    var too_big = $("#too_big");
    $("#lists span").html('▶');
    too_big.html('');
    no_connections.html('');
    window.intro = nodes.filter(function(i, elem) {
      return elem.indegree() > 13;
    });

    no_connections.hide();
    too_big.hide();
    $("#lists h4").show();
    intro.each(function(i, elem) {
      too_big.append($("<li>"+elem.data().title+"</li>"));
    });
    if (intro.length === 0) {
      $("#too_big_title").hide();
    }

    cy.remove(intro);

    var edges = cy.edges()
    var connected = edges.connectedNodes();
    cy.nodes().not(connected).each(function(i, elem) {
      no_connections.append($("<li>"+elem.data().title+"</li>"));
    });
    if (cy.nodes().not(connected).length === 0) {
      $("#no_connections_title").hide();
    }
    cy.remove(cy.nodes().not(connected));
    cy.remove(cy.edges().filter(function(i, elem){
      return elem.data().source === elem.data().target;
    }));

    cy.nodes().forEach(function(element, i, eles) {
      width = element.indegree()*3 + 20;
      element.css('width', width);
      element.css('height', width);
    });

    var valid_colors = ['#D9B48F','#FA4D70','#A19887','#C59B8F','#362B30'];
    cy.nodes().each(function(i,element){
      var data = element.data();
      var color;
      if (data.dep != dep) {
        color = 'rgb(0,0,0)';
        element.css('content', data.code);
      } else {
        var num = Math.floor(Math.random() * valid_colors.length);
        color = valid_colors[num];
      }
      data.color = color;
      if (localStorage[data.id]) {
        element.css('background-color', 'green');
      } else {
        element.css('background-color', color);
      }
    });

    cy.edges().each(function(i, elem){
      var d = elem.data();
      if (d.type === 'rec') {
        elem.css({
            'line-color': 'rgba(100,150,0,.5)',
            'target-arrow-color': 'rgba(50,150,0,.5)',
        });
      }
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
      infinite: false, // overrides all other options for a forces-all-the-time mode
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop

      // springy forces
      stiffness: 100,
      repulsion: 1000,
      damping: 0.5
    });

    cy.on('tap', 'node', {}, fillDetails);
  }
  $("#department_form").submit(function(e){
    e.preventDefault();
    var code = $("#department").val().toUpperCase();
    if (elements[code]) {
      reset(code);
    }
  });

  $("#sidebar h4").click(function(e){
    var t = $(this);
    var s = t.find('span');
    t.next().toggle();
    if (s.html() === '▶') {
      s.html('▼');
    } else {
      s.html('▶');
    }

  });
  reset('CSCI');
});
