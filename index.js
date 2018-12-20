const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const popupUri = 'https://solid.github.io/solid-auth-client/dist/popup.html';

// Set up a local data store and associated data fetcher
const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store);

$('#login button').click(() => solid.auth.popupLogin({ popupUri }));
$('#logout button').click(() => solid.auth.logout());

solid.auth.trackSession(session => {
  const loggedIn = !!session;
  $('#login').toggle(!loggedIn);
  $('#logout').toggle(loggedIn);

  if (loggedIn) {
    $('#user').text(session.webId);
    // Use the user's WebID as default profile
    if (!$('#profile').val()) {
      $('#profile').val(session.webId);
    }

    start();
  }
});

const start = () => {
  $('#view').click(async function loadProfile() {
    // Load the person's data into the store
    const person = $('#profile').val();
    await fetcher.load(person);

    // Display their details
    const fullName = store.any($rdf.sym(person), FOAF('name'));
    $('#fullName').text(fullName && fullName.value);
  });

  $('#get-friends').click(async () => {
    const person = $('#profile').val();
    await fetcher.load(person);
    
    const friends = store.each($rdf.sym(person), FOAF('knows'));
    console.log('friends', friends);

    $('#friends').empty();

    if (friends.length === 0) {
      $('#friends').hide();
      $('#friends-msg').text('No friends :-(');
    } else {
      $('#friends').show();
      $('#friends-msg').html(friends.length + ' friend' + (friends.length > 1 ? 's' : '') + '!<br/>');
    }

    friends.forEach(async (friend) => {
      console.log('friend', friend)
      await fetcher.load(friend);
      const fullName = store.any(friend, FOAF('name'));
      $('#friends').append($('<li>')
         .text(fullName && fullName.value || friend.value));
    });
  });
}