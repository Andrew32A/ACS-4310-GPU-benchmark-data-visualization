// /repos: Retrieves the list of repositories owned by the user.
// /followers: Retrieves the list of followers of the user.
// /following: Retrieves the list of users that the user is following.
// /gists: Retrieves the list of gists created by the user.
// /events: Retrieves the public activity events for the user.
// /orgs: Retrieves the list of organizations that the user is a member of.
// /received_events: Retrieves the public activity events that the user has received.

fetch("https://api.github.com/users/andrew32a/events")
  .then((response) => response.json())
  .then((data) => {
    // Create a card for each data item
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      // Add data to the card
      const actorLogin = document.createElement("p");
      actorLogin.textContent = "Actor Login: " + item.actor.login;
      card.appendChild(actorLogin);

      const repoName = document.createElement("p");
      repoName.textContent = "Repository Name: " + item.repo.name;
      card.appendChild(repoName);

      // Add the card to the container
      document.getElementById("cardContainer").appendChild(card);
    });
  })
  .catch((error) => console.log(error));
