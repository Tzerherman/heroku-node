require('../models/db');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports.connect = function(socket){
  console.log('User Connected');
  Message.find().sort({time:-1}).limit(10).exec(
      function(err, messages){
        if(err){
          res.render('error',{
            message:err.message,
            error:err
          });
        }
        else{
          console.log('last 10 messages');
          for(var i = messages.length-1; i>=0; i--){
            socket.emit('message', messages[i].message);
          }
        }
      });
}

module.exports.disconnect = function(){
  console.log('User Disconnected');
}

module.exports.message = function(msg, usr, io){
  console.log('message recieved!');
  var message = new Message({user:usr, message:msg, time: new Date()});
  message.save(function(err, data){
    if(err){
      console.log(err);
      res.status(500);
      res.render('error', {
        message:err.message,
        error: err
      });
    }
    else{
      console.log(data, 'message saved');
	  Message.find().sort({user:-1}).exec(
		function(err, messages){
			if(err){
				console.log('Errrofuck');
				res.render('error',{
					message:err.message,
				error:err});
			}
			else{
				console.log('Top 10 Scores');
				for(var i = 0; i<messages.length; i++){
					console.log(messages[i].message);
					console.log(messages[i].user);
					io.emit('message', messages[i].message, messages[i].user);
				}
        }
      });
	}
  });
}


