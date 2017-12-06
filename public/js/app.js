/* global jQuery, handle, $, api */
'use strict';

const ITEMS_URL = '/api/v1/spells/';

const renderPage = function (store) {
  if (store.demo) {
    $('.view').css('background-color', 'gray');
    $('#' + store.view).css('background-color', 'white');
  } else {
    $('.view').hide();
    $('#' + store.view).show();
  }
};

const renderResults = function (store) {
  const listItems = store.list.map((item) => {
    return `<li id="${item._id}">
                <a href="${item.url}" class="detail">${item.name}</a>
              </li>`;
  });
  $('#result').empty().append('<ul>').find('ul').append(listItems);
};

const renderEdit = function (store) {
  const el = $('#edit');
  const item = store.item;
  el.find('[name=title]').val(item.title);
  el.find('[name=content]').val(item.content);
}; 

const renderDetail = function (store) {
  const el = $('#detail');
  const item = store.item;
  el.find('.name').text(item.name);
  el.find('.description').text(item.description);
  el.find('.higher-levels').text(item.higher_levels);
  el.find('.casting-time').text(item.casting_time);
  el.find('.duration').text(item.duration);
  el.find('.range').text(item.range);
  el.find('.components').text(item.components.raw);
  el.find('.type').text(item.type);
};

const handleSearch = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const title = el.find('[name=title]').val();
  var query;
  if (title) {
    query = {
      title: el.find('[name=title]').val()
    };
  }
  api.search(query)
    .then(response => {
      store.list = response;
      renderResults(store);

      store.view = 'search';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleCreate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    title: el.find('[name=title]').val(),
    content: el.find('[name=content]').val()
  };
  api.create(document)
    .then(response => {
      store.item = response;
      store.list = null; //invalidate cached list results
      renderDetail(store);
      store.view = 'detail';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleUpdate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    id: store.item.id,
    title: el.find('[name=title]').val(),
    content: el.find('[name=content]').val()
  };
  api.update(document, store.token)
    .then(response => {
      store.item = response;
      store.list = null; //invalidate cached list results
      renderDetail(store);
      store.view = 'detail';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleDetails = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const id = el.closest('li').attr('id');

  api.details(id)
    .then(response => {
      store.item = response;
      renderDetail(store);

      store.view = 'detail';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};

const handleRemove = function (event) {
  event.preventDefault();
  const store = event.data;
  const id = store.item.id;

  api.remove(id, store.token)
    .then(() => {
      store.list = null; //invalidate cached list results
      return handleSearch(event);
    }).catch(err => {
      console.error(err);
    });
};
const handleViewWizards = function (event) {
  event.preventDefault();
  const store = event.data;
  store.view = 'wizards';
  renderPage(store);
};
const handleViewList = function (event) {
  event.preventDefault();
  const store = event.data;
  if (!store.list) {
    handleSearch(event);
    return;
  }
  store.view = 'search';
  renderPage(store);
};
const handleViewEdit = function (event) {
  event.preventDefault();
  const store = event.data;
  renderEdit(store);

  store.view = 'edit';
  renderPage(store);
};
const handleViewHome = function (event) {
  event.preventDefault();
  const store = event.data;
  store.view='home';
  renderPage(store);
};

//on document ready bind events
jQuery(function ($) {

  const STORE = {
    demo: true,        // display in demo mode true | false
    view: 'list',       // current view: splash page | spell list | spell details | wizards | wizard details | spell book
    query: {},          // search query values
    list: null,         // search result - array of objects (documents)
    item: null,         // currently selected document
    activeWizard: {}
  };

  $('#create').on('submit', STORE, handleCreate);
  $('#search').on('submit', STORE, handleSearch);
  $('#edit').on('submit', STORE, handleUpdate);

  $('#result').on('click', '.detail', STORE, handleDetails);
  $('#detail').on('click', '.remove', STORE, handleRemove);
  $('#detail').on('click', '.edit', STORE, handleViewEdit);

  $(document).on('click', '.viewWizards', STORE, handleViewWizards);
  $(document).on('click', '.viewSpellSearch', STORE, handleViewList);
  $(document).on('click', '.viewHome', STORE, handleViewHome);

  // start app by triggering a search
  $('#search').trigger('submit');
  $('.viewHome').trigger('click');

});
