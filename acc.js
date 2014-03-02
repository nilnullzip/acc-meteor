// Collect accelerometer samples and save to MongoDB collection named "samples".

Samples = new Meteor.Collection("samples");

testdata = {samples: [1,2,3]}

if (Meteor.isClient) {

  Template.radios.radio_value = function(input){
    return Session.get("radio_value") == input;
  };

  Template.radios.samples_json = function(input){
    var samples = Samples.find({}, {sort: {created_at: 1}});
    var l = [];
    samples.forEach(function (s) {
      l = l.concat(s.samples);
    });
    return JSON.stringify(l);
  };

  Template.radios.events({
    'click input': function () {
      Session.set("radio_value", $("input:radio[name=display]:checked").val())
    }
  });

  Template.nsamples.nsamples = function () {
    return Samples.find().count();
  };

  Template.radios.recentsamples = function () {
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
    Session.set("radio_value", $("input:radio[name=display]:checked").val())

    var timestamp = 0;
    var docs = [];

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
        doc.t = t;
        docs.push(doc);

        if (docs.length > 20) {
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
