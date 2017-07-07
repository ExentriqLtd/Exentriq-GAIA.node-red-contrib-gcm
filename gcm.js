module.exports = function(RED) {
	
    function Gcm(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var gcm = require('node-gcm');
        var util = require('util');

        try {
        	this.on('input', function(msg) {
        		
        		var title = 'Notification';
        		if (config.hasOwnProperty('title')) { 
        			if(config.title!= null && config.title != ''){
        				title=config.title;
      			  }
        		}
        		if (msg.hasOwnProperty('title')) {
    			  if(msg.title!= null && msg.title != ''){
    				  title=msg.title;
    			  }
    			}
        		
        		var data = {};
        		if (msg.hasOwnProperty('data')) {
        		    data = msg.data;
      			}
        		
        		var uuid = String(Math.floor((Math.random() * 100000) + 1));
        		
        		data.title=title;
        		data.message = msg.payload;
        		data.notId = uuid;
        		data.style='inbox';
        		data.summaryText='There are %n% notifications';
        		data.priority = 2;
        		if(msg.badge){
        		    data.badge = msg.badge;
                        }
        		
        		var message = new gcm.Message({
    			  data: data
    			});        		

        		var regTokens = [];
        		if(util.isArray(msg.topic)){
        			regTokens = msg.topic;
        		}
        		else{
        			regTokens.push(msg.topic);
        		}
        		
        		
        		
        		        		
        		// Set up the sender with you API key
        		var sender = new gcm.Sender(config.key);

        		// Now the sender can be used to send messages
        		sender.send(message, { registrationIds: regTokens }, function (err, result) {
        		    if(err) console.error(err);
        		    else    console.log(result);
        		});
            
        	});
        }
    	catch(e){
    		node.error("Error.", msg);
        }
    }
    
    RED.nodes.registerType("gcm",Gcm);
}