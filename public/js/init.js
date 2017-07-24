//pubnub account: ankur.hsd@gmail.com
var publishKey = 'pub-c-1631356c-d7c0-4859-9330-bf399270feab',
    subscribeKey = 'sub-c-39a73d0c-7031-11e7-96c9-0619f8945a4f',
    secreteKey = 'sec-c-NDMwNzdkYTMtMDliNi00OWY3LTkxMDUtNTBlOTkxYjFhNDI4';

$("#connectButton").click(function (e) {
    e.preventDefault();
    var username = $('#username').val();
    var currentRoom = $('#currentRoom').val();

    if(!currentRoom || !username) { return false; }

    $.ajax({
        type: "POST",
        url: '/grant',
        data: JSON.stringify({user: username, room: currentRoom}),
        dataType: "json",
        contentType: "application/json",
        success: function (grantApiResponse) {
          initiatePubnubCode(username, currentRoom, grantApiResponse.authKey);
        },
        error: function (grantApiError) {
            console.log(grantApiError);
        }
      });
});

var initiatePubnubCode = function(username, currentRoom, authKey) {
  if(!username || !currentRoom) {
    alert('username or room not found.');
  } else {
    console.log('creating pubnub client');
    $("#afterLoginUi").show();
    $("#beforeLoginUi").hide();

    var pubnubClient = new PubNub({
      publishKey: publishKey,
      subscribeKey: subscribeKey,
      authKey: authKey,
      uuid: username
    });

    pubnubClient.addListener({
      message: function(message) {},
      presence: function(data) {
        console.log(JSON.stringify(data, null, 4));
      },
      status: function(statusData) {}
    });

    pubnubClient.subscribe({
      channels: [currentRoom],
      withPresence: true
    });

    $("#disconnectButton").click(function(e) {
        e.preventDefault();

        if(pubnubClient) {
            pubnubClient.unsubscribeAll();
            pubnubClient.stop();
        }

        /*setTimeout(function() {
            window.location.reload();
        }, 5000);*/
    });
  }
};

