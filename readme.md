Capture accelerometer samples and save to MongoDB
-------------------------------------------------
##### Juan Pineda nilnullzip on GitHub

Based on HTML5 accelerometer interface and Meteor web framework.

Quick start:

    # install meteor
    curl https://install.meteor.com | /bin/sh
    
    # clone acc-meteor
    git clone git@github.com:nilnullzip/acc-meteor.git
    
    # run local server
    cd acc-meteor
    meteor

At this point the app will be running on the dev machine and can be accessed at: http://localhost:3000/. Your dev machine will likely not support the accelerometer, so it won't capture any samples. However, it will have a view of the database.

Now open the app on your mobile phone accessing the dev machine. Obviously will need to substitute your dev machine's IP address for "localhost" in the URL. You should see a lively display of changing sample data on the mobile.
