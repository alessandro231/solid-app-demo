const popupUri = 'https://solid.github.io/solid-auth-client/dist/popup.html';

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
  $('#set-name').click(async function setName() {
    const VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

    const store = $rdf.graph();
    const updater = new $rdf.UpdateManager(store);

    const person = $('#profile').val();
    const name = $('#new-name').val();
    
    // const card = person.split('#')[0];
    // const doc = $rdf.NamedNode.fromValue(card);
    const doc = $rdf.sym(person).doc();

    const ins = $rdf.st(person, VCARD('fn'), name, $rdf.sym(person).doc());
    const del = [];

    updater.update(del, ins, (uri, ok, message) => {
      if (ok) {
        console.log('Name changed to '+ name)
      }
      else {
        alert(message)
      }
    })
  });
}