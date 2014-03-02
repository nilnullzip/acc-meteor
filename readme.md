Capture accelerometer samples and save to MongoDB
-------------------------------------------------
##### Juan Pineda nilnullzip @ GitHub

Based on HTML5 accelerometer interface and Meteor web framework.

### Quick start

    # install meteor
    curl https://install.meteor.com | /bin/sh
    
    # clone acc-meteor
    git clone git@github.com:nilnullzip/acc-meteor.git
    
    # run local Meteor server
    cd acc-meteor
    meteor

At this point the app will be running on the dev machine and can be accessed at: http://localhost:3000/. Your machine will likely not support the accelerometer, so it won't capture any samples. However, it will be able to view the database.

Now open the app page on your mobile phone. (Obviously will need to substitute your dev machine's IP address in the URL.) You should see a lively display of changing data/info. The page opened on the server will show the data changing live as it is saved in the database.

### Access the database

The locally maintained database can be accessed on port 3001

    $ mongo --port 3001
    > use meteor
    > db.samples.count()
    > db.samples.find()
