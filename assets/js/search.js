(function () {
  var searchInput = document.getElementById("search-input");
  var searchStatus = document.getElementById("search-status");
  var searchResults = document.getElementById("search-results");
  var searchResultsList = document.getElementById("search-results-list");
  var paginatedPosts = document.getElementById("paginated-posts");

  if (!searchInput) return;

  var index = null;
  var posts = null;
  var debounceTimer = null;

  function loadIndex() {
    if (posts) return Promise.resolve();
    return fetch("/search.json")
      .then(function (response) {
        if (!response.ok) throw new Error("Failed to fetch search index");
        return response.json();
      })
      .then(function (data) {
        posts = data;
        index = lunr(function () {
          this.ref("url");
          this.field("title", { boost: 10 });
          this.field("tags", { boost: 5 });
          this.field("categories", { boost: 5 });
          this.field("excerpt");
          this.field("content");
          data.forEach(function (post) {
            this.add({
              url: post.url,
              title: post.title,
              tags: (post.tags || []).join(" "),
              categories: (post.categories || []).join(" "),
              excerpt: post.excerpt,
              content: post.content || "",
            });
          }, this);
        });
      });
  }

  function performSearch(query) {
    if (!query || !query.trim()) {
      clearSearch();
      return;
    }

    if (typeof lunr === "undefined") {
      searchStatus.textContent = "Search is loading...";
      return;
    }

    loadIndex()
      .then(function () {
        var results;
        try {
          results = index.search(query + "*");
          if (results.length === 0) {
            results = index.search(query);
          }
        } catch (e) {
          try {
            results = index.search(query.replace(/[:\*\~\^\+\-]/g, ""));
          } catch (e2) {
            results = [];
          }
        }

        var postMap = {};
        posts.forEach(function (p) {
          postMap[p.url] = p;
        });

        var html = "";
        results.forEach(function (result) {
          var post = postMap[result.ref];
          if (!post) return;
          html +=
            "<li>" +
            '<span class="post-meta">' +
            post.date +
            "</span>" +
            "<h3>" +
            '<a class="post-link" href="' +
            post.url +
            '">' +
            escapeHtml(post.title) +
            "</a></h3>" +
            "<p>" +
            escapeHtml(post.excerpt) +
            "</p>" +
            "</li>";
        });

        searchResultsList.innerHTML = html;
        searchResults.style.display = "block";
        if (paginatedPosts) paginatedPosts.style.display = "none";

        if (results.length === 0) {
          searchStatus.textContent = 'No posts found for "' + query + '"';
        } else {
          searchStatus.textContent =
            results.length +
            " post" +
            (results.length !== 1 ? "s" : "") +
            " found";
        }
      })
      .catch(function (err) {
        console.error("Search error:", err);
        searchStatus.textContent = "Search error — check console for details";
      });
  }

  function clearSearch() {
    searchInput.value = "";
    searchStatus.textContent = "";
    searchResults.style.display = "none";
    searchResultsList.innerHTML = "";
    if (paginatedPosts) paginatedPosts.style.display = "";
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    var query = searchInput.value;
    debounceTimer = setTimeout(function () {
      performSearch(query);
    }, 250);
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      clearSearch();
      searchInput.blur();
    }
  });
})();
