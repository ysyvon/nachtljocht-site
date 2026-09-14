(function () {
  document.querySelectorAll('[data-flipbook]').forEach(function (reader) {
    var total = Number(reader.dataset.pages);
    var page = 1;
    var image = reader.querySelector('[data-flipbook-image]');
    var status = reader.querySelector('[data-flipbook-status]');
    var previous = reader.querySelector('[data-flipbook-prev]');
    var next = reader.querySelector('[data-flipbook-next]');
    var path = reader.dataset.pagePath;
    function pad(number) { return String(number).padStart(2, '0'); }
    function render() {
      image.src = path.replace('{page}', pad(page));
      image.alt = reader.dataset.title + ', page ' + page;
      status.textContent = 'Page ' + page + ' of ' + total;
      previous.disabled = page === 1;
      next.disabled = page === total;
    }
    previous.addEventListener('click', function () { if (page > 1) { page -= 1; render(); } });
    next.addEventListener('click', function () { if (page < total) { page += 1; render(); } });
  });
})();
