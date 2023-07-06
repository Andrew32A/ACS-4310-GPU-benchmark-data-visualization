// /repos: Retrieves the list of repositories owned by the user.
// /followers: Retrieves the list of followers of the user.
// /following: Retrieves the list of users that the user is following.
// /gists: Retrieves the list of gists created by the user.
// /events: Retrieves the public activity events for the user.
// /orgs: Retrieves the list of organizations that the user is a member of.
// /received_events: Retrieves the public activity events that the user has received.

fetch("https://api.github.com/users/andrew32a/repos")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
