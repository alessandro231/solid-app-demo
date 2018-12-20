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
    // TODO
  });

  $('#get-friends').click(async () => {
    // TODO
  });
}