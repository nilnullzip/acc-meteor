// Collect accelerometer samples and save to MongoDB collection named "samples".

Samples = new Meteor.Collection("samples"); // Get/create MongoDB collection

testdata = {samples: [1,2,3]}

if (Meteor.isClient) {

  // Live display of number of samples

  Template.nsamples.nsamples = function () {
    return Samples.find().count();
  };

  Template.nsamples.events({
    'click input#clear': function () {
      console.log("Clearing all samples")
      Samples.find().forEach(function(d){Samples.remove(d._id)});
    }
  });

  // JSON display

  Template.radios.samples_json = function(input){
    var samples = Samples.find({}, {sort: {created_at: 1}});
    var l = [];
    samples.forEach(function (s) {
      l = l.concat(s.samples);
    });
    return JSON.stringify(l);
  };

  // Recent samples display

  Template.radios.recentsamples = function () {
    var s = Samples.findOne({}, {sort: {created_at: -1}});
    if (s != null) {
      return _.map(s["samples"], JSON.stringify );
    } else {
      return [];
    }
  };

  // Manage radio buttons

  Template.radios.radio_value = function(input){
    return Session.get("radio_value") == input;
  };

  Template.radios.events({
    'click input': function () {
      Session.set("radio_value", $("input:radio[name=display]:checked").val())
    }
  });

  // At startup set up device motion event handler.

  Meteor.startup(function () {

    Session.set("radio_value", $("input:radio[name=display]:checked").val())
    var timestamp = 0;
    var samples = [];

    if (window.DeviceMotionEvent != undefined) {

      // Device motion event service routine!
            
      window.ondevicemotion = function(e) {

        // Measure sample interval and siplay on page

        var t = Date.now();
        $("#measured").html(t - timestamp);
        $("#interval").html(e.interval);
        timestamp = t

        // Create the sample

        var sample = {}
        sample.x = e.accelerationIncludingGravity.x;
        sample.y = e.accelerationIncludingGravity.y;
        sample.z = e.accelerationIncludingGravity.z;
        $("#accx").html(sample.x);
        $("#accy").html(sample.y);
        $("#accz").html(sample.z);

        if ( e.rotationRate ) {
          sample.a = e.rotationRate.alpha;
          sample.b = e.rotationRate.beta;
          sample.c = e.rotationRate.gamma;
          $("#rota").html(sample.a);
          $("#rotb").html(sample.b);
          $("#rotc").html(sample.c);
        }
        sample.t = t;

        // Every 20 samples save record in mongoDB.

        samples.push(sample);
        if (samples.length > 20) {
          created_at = new Date().getTime();
          Samples.insert({samples: samples, created_at: created_at});
          samples = [];
        }
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Stuff to run at startup on server goes here.
  });
}
