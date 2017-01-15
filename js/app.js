(function() {

  function makeReactive(obj, onChange) {
    return new Proxy(obj, {
      get: function(target, prop) {
        return prop in target ? target[prop] : "Doesn't exist!";
      },

      set: function(target, prop, value) {
        target[prop] = value;
        if(onChange) {
          onChange(target);
        }
        return target;
      }
    });
  }

  var DATA = JSON.parse(localStorage.getItem("table")) || {
    collection: [
      { id: 1, name: "Real Madrid", points: 43 },
      { id: 2, name: "FC Sevilla", points: 35 },
      { id: 3, name: "FC Barcelona", points: 33 }
    ]
  }

  function sortData(arr, prop) {
    return arr.sort((a, b) => {
      return a[prop] > b[prop] ? -1 : 1;
    });
  }

  DATA = makeReactive(DATA, function(val) {
    val.collection = sortData(val.collection, "points");
    localStorage.setItem("table", JSON.stringify(val));
    jsHTML.render(App(val), ".container");
  });

  var Heading = (props) => {
    return jsHTML.header({}, "La Liga Scoreboard");
  }

  var Button = (props) => {
    return jsHTML.button({"data-id": props.id}, jsHTML.text(props.value));
  }

  var Buttons = (props) => {
    
    var data = [
      { id: props.id, value: "+" },
      props.points,
      { id: props.id, value: "-" }
    ];

    var list = data.map(elData => {
      if(typeof elData === "object") {
        return Button(elData);
      } else {
        return jsHTML.text(elData)
      }
    });
      
      
    return jsHTML.div({className: "buttons"}, list);
  }

  var TeamItem = (props) => {
    return jsHTML.li({}, [jsHTML.text(props.name), Buttons(props)]);
  }

  var Team = (props) => {
    
    var list = props.collection.map(team => {
      return TeamItem(team);
    });

    function changePoints(id, operation) {
      DATA.collection = DATA.collection.map(item => {
        if(item.id === id) {
          item.points = operation === "+" ? item.points + 3 : item.points - 3;;
        }
        return item;
      });
    }


    function handleChange(e) {
      if(e.target.nodeName === "BUTTON") {
        var id = +e.target.dataset.id;
        switch(e.target.innerHTML) {
          case "+":
            changePoints(id, "+");
            break;
          case "-":
            changePoints(id, "-");
            break;
        }
      }
    }

    var events = {
      "click": handleChange
    }

    var component = jsHTML.ol({className: "scoreboard"}, list);
    jsHTML.addEvents(component, events);
    return component;
  }

  var App = (props) => {
    return jsHTML.div({}, [
        Heading(),
        Team(DATA)
        ]);
  }

  jsHTML.render(App(DATA), ".container");
})();
