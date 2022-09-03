// update the client id, I have set it according to my localhost and production apps
const client_id = window.location.host=='localhost:3000'?'4d9e5abf86386db8ac90':'a5c2e83098c80d00771f';

const authorize_uri = 'https://github.com/login/oauth/authorize';
const redirect_uri = `${window.location.protocol}//${window.location.host}/users/`;
const scope = 'public_repo';
const link = document.getElementById('login');
link.href = `${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
