$.getJSON("/articles", function (data) {

  for (var i = 35; i < data.length; i++) {
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#articles").append(createCard(data[i]));
  }
});

function createCard(article) {
  const card = $("<div class='card text-white bg-dark mb-3' style='max-width: 55rem;'>");
  const cardBody = $("<div class='card-body'>")
    .append($("<h3 class='card-title'>"))
    .append(
      $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
      .attr("href", article.link)
      .text(article.title))
      .append($("<button type='button' class='btn btn-warning'>Save Article</button>")
  );
  card.append(cardBody);
  card.data("_id", article.id);

  return card;

}