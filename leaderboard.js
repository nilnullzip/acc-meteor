// Collect accelerometer samples and save to MongoDB collection named "samples".

Samples = new Meteor.Collection("samples");

testdata = {samples: [1,2,3]}

if (Meteor.isClient) {
  /* Possibly helpful old code here for sessions
  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
      //Players.update(Session.get("selected_player"), {$inc: {score: 5}});
      Players.update(this._id, {$inc: {score: 5}});
    }
  });
  */

  Template.nsamples.nsamples = function () {
    return Samples.find().count();
  };

  Template.recentsamples.sample = function () {
    var s = Samples.findOne({}, {sort: {created_at: -1}});
    if (s != null) {
      return _.map(s["samples"], JSON.stringify );
    } else {
      return [];
    }
   };

  Template.buttons.events({
    'click input#clear': function () {
      console.log("Clearing all samples")
      Samples.find().forEach(function(d){Samples.remove(d._id)});
    }
  });

  Meteor.startup(function () {

    var timestamp = 0;
    var docs = [];

    document.getElementById("sanity").innerHTML = "JS working..."

    if (window.DeviceMotionEvent != undefined) {
            
      window.ondevicemotion = function(e) {
        var t = Date.now()
        e.interval = .020
        document.getElementById("measured").innerHTML = t - timestamp
        document.getElementById("interval").innerHTML = e.interval
        timestamp = t

    //    ax = event.accelerationIncludingGravity.x * 5;
    //    ay = event.accelerationIncludingGravity.y * 5;
        var doc = {}
        document.getElementById("accx").innerHTML = e.accelerationIncludingGravity.x;
        document.getElementById("accy").innerHTML = e.accelerationIncludingGravity.y;
        document.getElementById("accz").innerHTML = e.accelerationIncludingGravity.z;
        doc.x = e.accelerationIncludingGravity.x;
        doc.y = e.accelerationIncludingGravity.y;
        doc.z = e.accelerationIncludingGravity.z;

        if ( e.rotationRate ) {
          document.getElementById("rota").innerHTML = e.rotationRate.alpha;
          document.getElementById("rotb").innerHTML = e.rotationRate.beta;
          document.getElementById("rotc").innerHTML = e.rotationRate.gamma;
          doc.a = e.rotationRate.alpha;
          doc.b = e.rotationRate.beta;
          doc.c = e.rotationRate.gamma;
        }
        docs.push(doc);
        document.getElementById("sanity").innerHTML = "docs.length: " + docs.length;      
        if (docs.length > 20) {
          document.getElementById("sanity").innerHTML = "inserted!"
          created_at = new Date().getTime();
          Samples.insert({samples: docs, created_at: created_at});
          docs = [];
        }
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Stuff to run at startup goes here.
  });
}
