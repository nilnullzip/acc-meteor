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
        var t = Date.now();
        $("#measured").html(t - timestamp);
        $("#interval").html(e.interval);
        timestamp = t

        var doc = {}
        doc.x = e.accelerationIncludingGravity.x;
        doc.y = e.accelerationIncludingGravity.y;
        doc.z = e.accelerationIncludingGravity.z;
        $("#accx").html(doc.x);
        $("#accy").html(doc.y);
        $("#accz").html(doc.z);

        if ( e.rotationRate ) {
          doc.a = e.rotationRate.alpha;
          doc.b = e.rotationRate.beta;
          doc.c = e.rotationRate.gamma;
          $("#rota").html(doc.a);
          $("#rotb").html(doc.b);
          $("#rotc").html(doc.c);
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
