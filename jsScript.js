$(document).ready(function(){
        
        //page set up
        var $body = $('body');

        var tweetDiv = $('#tweets');
        var tweetMain = $('#tweetMain');
        var tweetSecondary = $('#tweetSecondary');
        
        var createButton = function(value, id){
          var button = $('<div class="b"></div>');
          button.attr('id', id);
          button.text(value);
          return button;
        }
        var getMain = new createButton('Update Main Feed', 'main');
        var getUser = new createButton('Update Users Tweets', 'user');

        getMain.css('float','left');
        getUser.css('float','right');
        tweetDiv.before([getMain, getUser]);
       
        //program logic
        var Tweets = [];
        var userTweets = [];
        var user = null;

        var convertTime = function(date){
          var currentTime = new Date();
          var diff = (currentTime.getTime() - date.getTime())/1000;
          //console.log('curr: ', currentTime, '\n', 'date: ', date.toTimeString(), '\n', 'diff: ', diff);
          if(diff < 60){
            return (Math.floor(diff+1)+' seconds ago');
          }else if(diff < 3600){
            return (Math.floor(diff/60)+' minutes ago');
          }else{
            var time = date.toTimeString().split(' ')[0];
            return time;
          }
        }

        var displayTweets = function(list, id){
          var index = list.length-1;
          var messages = []
          while(index >= 0){
            var tweet = list[index];
            var time = convertTime(tweet.created_at);
            var message = ('<p class="name">'+'@' + tweet.user + ':'+'</p><p class="tab">' + tweet.message +' --('+ time +')'+ '</p>');
            messages.push(message);
            index -= 1;
          }
          $(id).html(messages);
          $('.name').on('click', nameClick);
        }
        
        var refreshTweets = function(){
          getTweets();
          if(userTweets.length > 0){
            moreTweets();
          }
        }

        var getTweets = function(){
          var args = Array.prototype.slice.call(arguments);
          if(args.length <= 1){
            Tweets = streams.home.slice(0, streams.home.length);
            args = [Tweets, '#tweetMain'];
          }
          //console.log(Tweets);
          if(args[0].length > 100){
            args[0] = args[0].slice(args[0].length-100,args[0].length);
          }else{
            args[0] = args[0].slice(0,args[0].length);
          }
          displayTweets(args[0], args[1]);
        }

        var moreTweets = function(){
          userTweets = streams.users[user].slice(0,streams.users[user].length);
          getTweets(userTweets, '#tweetSecondary'); 
          //refreshTweets();
        }

        var nameClick = function(event){
          user = event.currentTarget.textContent.slice(1,event.currentTarget.textContent.length-1);
          userTweets = streams.users[user].slice(0,streams.users[user].length);
          getTweets(userTweets, '#tweetSecondary');
          getUser.text('Update '+user+' Tweets');
          refreshTweets();
        }     

        //event handling and page initialization
        getTweets();
        var refreshInterval = setInterval(refreshTweets, 30000);
        $('#main').on('click', getTweets);
        $('#user').on('click', moreTweets);
        $('.name').on('click', nameClick);

      });