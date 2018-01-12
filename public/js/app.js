/* global jQuery, handle, $, api */
'use strict';

const COMPENDIUM_URL = '/api/v1/spells/';
const WIZARDS_URL = '/api/v1/wizards/';

const renderPage = function (store) {
  if (store.demo) {
    $('.view').css('background-color', 'gray');
    $('#' + store.view).css('background-color', 'white');
  } else {
    $('.view').hide();
    $(`#${store.view}`).show();
    console.log(store.view);
  }
};

const renderResults = function (store) {
  const listItems = store.list.map((item) => {
    return `<li id="${item._id}">
                <a href="${item.url}" class="compendiumDetail">${item.name}</a>
              </li>`;
  });
  $('#result').empty().append('<ul>').find('ul').append(listItems);
};

const renderCompendiumResults = function (store) {
  const listItems = store.compendiumList.map((item) => {
    return `<li id="${item._id}">
                <a href="${item.url}" class="compendiumDetail">${item.name}</a>
              </li>`;
  });
  $('#result').empty().append('<ul>').find('ul').append(listItems);
};

const renderCompendiumSearchResults = function (store) {
  const listItems = store.compendiumSearchList.map((item) => {
    return `<li id="${item._id}">
                <a href="${item.url}" class="compendiumSearchDetail">${item.name}</a>
              </li>`;
  });
  $('#result').empty().append('<ul>').find('ul').append(listItems);
};

const renderWizardsResults = function (store) {
  const listItems = store.wizardsList.map((item) => {
    // console.log(item.url);
    return `<li id="${item._id}">
                <a href="${item.url}" class="this-spell-book">${item.name}, level ${item.level} wizard</a>
              </li>`;
  });
  $('#allWizards').empty().append('<ul>').find('ul').append(listItems);
};

const renderWizardEdit = function (store) {
  const el = $('#edit-wizard');
  const item = store.item;
  el.find('[name=name]').val(item.name);
  el.find('[name=level]').val(item.level);
  el.find('[name=intelligence]').val(item.intelligence);
};

const renderDetail = function (store) {
  const el = $('#compendiumDetail');
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

const renderSpellBookDetail = function (store) {
  const el = $('#spell-book-detail');
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

const renderWizardDetail = function (store) {
  const el = $('#wizardDetail');
  const item = store.item;
  el.find('.name').text(item.name);
  el.find('.level').text(item.level);
  el.find('.intelligence').text(item.intelligence);
  el.find('.intelligence-modifier').text(item.intelligenceModifier);
  el.find('.max-prepared').text(item.maxPrepared);
};

const renderSpellBookResults = function (store) {

  console.log('state of spellbooklist', store.spellBookList);
  console.log('store', store);

  const listItems = store.spellBookList.map((item) => {
    const spellNameFind = function (spell) {
      return spell._id === item.spell_id;
    };
    const spellName = store.spellBookListDetails.find(spellNameFind);
  
    return `<li id="${item.spell_id}">
                <a href="${item.url}" class = "see-spell-book-details ${item.prepared ? 'spell-prepared' : ''}">${spellName.name}, ${spellName.type}</a>
                <br><a href="${item.url}" class = "spell-prepared-toggle"><button type="button">${item.prepared ? 'Un-Prepare spell' : 'Prepare spell'}</button></a>
                <a href="${item.url}" class = "spell-book-remove"><button type="button">Remove spell</button></a><hr>
              </li>`;
  });
  
  $('#spell-book-result').html(`<h3>${store.activeWizard.name}'s Spell Book: </h3>`);
  $('#spell-book-result').append('<ul>').find('ul').append(listItems);
};

const handleCompendium = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const spellName = el.find('[name=spellName]').val();
  var query;
  if (spellName) {
    query = {
      title: el.find('[name=spellName]').val()
    };
  }
  api.spellSearch(query)
    .then(response => {
      store.compendiumList = response;
      renderCompendiumResults(store);

      store.view = 'compendiumOfSpells';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleCompendiumDetails = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const id = el.closest('li').attr('id');
  store.activeSpellId = id;

  api.spellDetails(id)
    .then(response => {
      store.item = response;
      renderDetail(store);

      store.view = 'compendiumDetail';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};

// const handleSpellBookCompendiumSearch = function (event) {
//   event.preventDefault();
//   const store = event.data;
//   const el = $(event.target);
//   const spellName = el.find('[name=spellName]').val();
//   var query;
//   if (spellName) {
//     query = {
//       title: el.find('[name=spellName]').val()
//     };
//   }
//   api.spellSearch(query)
//     .then(response => {
//       store.compendiumSearchList = response;
//       renderCompendiumSearchResults(store);

//       store.view = 'spell-book-compendium-search';
//       renderPage(store);
//     }).catch(err => {
//       console.error(err);
//     });
// };

const handleWizards = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const spellName = el.find('[name=wizardName]').val();
  var query;
  if (spellName) {
    query = {
      title: el.find('[name=wizardName]').val()
    };
  }
  api.wizardSearch(query)
    .then(response => {
      store.wizardsList = response;
      renderWizardsResults(store);

      store.view = 'wizards';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

// const handleCreate = function (event) {
//   event.preventDefault();
//   const store = event.data;
//   const el = $(event.target);

//   const document = {
//     title: el.find('[name=title]').val(),
//     content: el.find('[name=content]').val()
//   };
//   api.create(document)
//     .then(response => {
//       store.item = response;
//       store.list = null; //invalidate cached list results
//       renderDetail(store);
//       store.view = 'compendiumDetail';
//       renderPage(store);
//     }).catch(err => {
//       console.error(err);
//     });
// };

const handleCreateWizard = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    name: el.find('[name=name]').val(),
    level: el.find('[name=level]').val(),
    intelligence: el.find('[name=intelligence]').val()
  };
  api.wizardCreate(document)
    .then(response => {
      store.item = response;
      store.wizardsList = null; //invalidate cached list results
      renderWizardDetail(store);
      store.view = 'wizardDetail';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleWizardUpdate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    id: store.activeWizard._id,
    name: el.find('[name=name]').val(),
    level: el.find('[name=level]').val(),
    intelligence: el.find('[name=intelligence]').val()
  };
  api.wizardUpdate(document, store.token)
    .then(response => {
      store.item = response;
      store.wizardsList = null; //invalidate cached list results
      renderWizardDetail(store);
      store.view = 'wizardDetail';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleWizardDetails = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const id = el.closest('li').attr('id');

  api.wizardDetails(id)
    .then(response => {
      store.item = response;
      renderWizardDetail(store);

      store.view = 'wizardDetail';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};

const handleWizardRemove = function (event) {
  event.preventDefault();
  const store = event.data;
  const id = store.item._id;
  // console.log(store);
  api.wizardRemove(id, store.token)
    .then(() => {
      store.wizardsList = null; //invalidate cached list results
      return handleWizards(event);
    }).catch(err => {
      console.error(err);
    });
};

const handleSpellBookDetails = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const id = el.closest('li').attr('id');
  // console.log(id);

  api.spellDetails(id)
    .then(response => {
      store.item = response;
      renderSpellBookDetail(store);

      store.view = 'spell-book-detail';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};

const handleAddSpell = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    _id: store.activeSpellId
  };

  const id = store.activeWizard._id;

  store.activeWizard.spellBook.find( function (val) {
    console.log('val', val);
    if (!val.spell_id === store.activeSpellId) {
      api.spellBookAdd(id, document, store.token)
        .then(results => {
          store.activeSpellId = null; //invalidate cached active spell id
  
          console.log('result', results);
          store.activeWizard._id = results._id;
          store.spellBookList = results.spellBook;
          console.log('bang', store.spellBookList);
          renderSpellBookResults(store);
          
          store.view = 'spell-book-section';
          console.log('view', store.view);
          renderPage(store);
        }).catch(err => {
          store.error = err;
        });
    }
  });


  api.spellBookAdd(id, document, store.token)
    .then(results => {
      store.activeSpellId = null; //invalidate cached active spell id

      console.log('result', results);
      store.activeWizard._id = results._id;
      store.spellBookList = results.spellBook;
      console.log(store.spellBookList);
      renderSpellBookResults(store);

      store.view = 'spell-book-section';
      renderPage(store);
    }).catch(err => {
      store.error = err;
    });
};

const handleSpellPreparedToggle = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const spellId = el.closest('li').attr('id');
  const id = store.activeWizard._id;

  const document = {
    spell_id: spellId
  };

  console.log('I am here');
  console.log('document', document);
  console.log('id', id);

  api.spellBookToggle(id, document)
    .then((response) => {
      console.log('response', response);
      store.spellBookList = response.spellBook;
     
      renderSpellBookResults(store);

      store.view = 'spell-book-section';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};


const handleSpellBookRemove = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const spellId = el.closest('li').attr('id');
  const id = store.activeWizard._id;

  const document = {
    spell_id: spellId
  };

  api.spellBookRemove(id, document)
    .then((response) => {
      store.spellBookList = response.spellBook;
      renderSpellBookResults(store);

      store.view = 'spell-book-section';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};

const handleSpellBookWizardDetails = function (event) {
  event.preventDefault();
  const store = event.data;

  const id = store.activeWizard._id;

  api.wizardDetails(id)
    .then(response => {
      store.item = response;
      renderWizardDetail(store);

      store.view = 'wizardDetail';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};

const handleSpellBook = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  // console.log(store.activeWizard._id);

  const id = store.activeWizard._id || el.closest('li').attr('id');
  // store.activeWizardId = el.closest('li').attr('id');
  // console.log(store.activeWizardId);
  const detailsPromises = [];

  api.wizardDetails(id)
    .then(wizard => {
      store.activeWizard = wizard;
      console.log('active wiz spellBook', store.activeWizard.spellBook);
      store.activeWizard.spellBook.map( spell => {
        detailsPromises.push(api.spellDetails(spell.spell_id));
      });
      return Promise.all(detailsPromises);
    }).then(promises => {
      store.spellBookListDetails = promises;
      console.log('should have the details', store.spellBookListDetails);
      api.spellBook(id)
        .then(response => {
          store.spellBookList = response;
          renderSpellBookResults(store);

          store.view = 'spell-book-section';
          renderPage(store);
        }).catch(err => {
          store.error = err;
        });
    });
};


const handleViewWizards = function (event) {
  event.preventDefault();
  const store = event.data;
  store.activeWizard = {};
  if (!store.wizardsList) {
    handleWizards(event);
    return;
  }
  store.view = 'wizards';
  renderPage(store);
};

// const handleViewList = function (event) {
//   event.preventDefault();
//   const store = event.data;
//   if (!store.list) {
//     handleSearch(event);
//     return;
//   }
//   store.view = 'search';
//   renderPage(store);
// };

const handleViewCompendium = function (event) {
  event.preventDefault();
  const store = event.data;
  if (!store.compendiumList) {
    handleCompendium(event);
    return;
  }
  store.view = 'compendiumOfSpells';
  renderPage(store);
};

// const handleViewEdit = function (event) {
//   event.preventDefault();
//   const store = event.data;
//   renderEdit(store);

//   store.view = 'edit';
//   renderPage(store);
// };

const handleViewEditWizard = function (event) {
  event.preventDefault();
  const store = event.data;
  renderWizardEdit(store);

  store.view = 'edit-wizard';
  renderPage(store);
};

const handleViewHome = function (event) {
  event.preventDefault();
  const store = event.data;
  store.view='home';
  renderPage(store);
};

const handleViewCreateWizard = function (event) {
  event.preventDefault();
  const store = event.data;
  store.view='createWizard';
  renderPage(store);
};

//on document ready bind events
jQuery(function ($) {

  const STORE = {
    demo: false,        // display in demo mode true | false
    view: 'list',       // current view: splash page | spell list | spell details | wizards | wizard details | spell book
    query: {},          // search query values
    wizardsList: null,
    compendiumList: null,         // search result - array of objects (documents)
    compendiumSearchList: null,
    spellBookList: null,
    spellBookListDetails: [],
    item: null,   // currently selected document
    activeSpellId: null,        // currently selected spell
    activeWizard: {}     // currently selected wizard
  };

  // $('#create').on('submit', STORE, handleCreate);
  // $('#edit').on('submit', STORE, handleUpdate);

  // $('#detail').on('click', '.remove', STORE, handleRemove);
  // $('#detail').on('click', '.edit', STORE, handleViewEdit);

  // compendium related listeners 
  $('#result').on('click', '.compendiumDetail', STORE, handleCompendiumDetails);
  $('#compendiumOfSpells').on('click', '.this-spell-book', STORE, handleSpellBook);
  $('#compendiumDetail').on('click', '.back-to-compendium', STORE, handleViewCompendium);
  $('#compendiumDetail').on('click', '.add-to-spell-book', STORE, handleAddSpell);
  // $('#compendiumOfSpells').on('submit', STORE, handleCompendium);

  // wizards related listeners
  $('#createWizard').on('submit', STORE, handleCreateWizard);
  $('#allWizards').on('click', '.wizardsDetail', STORE, handleWizardDetails);
  $('#wizards').on('click', '.viewCreateWizard', STORE, handleViewCreateWizard);
  $('#wizardDetail').on('click', '.view-edit-wizard', STORE, handleViewEditWizard);
  $('#edit-wizard').on('submit', STORE, handleWizardUpdate);
  $('#wizardDetail').on('click', '.delete-wizard', STORE, handleWizardRemove);
  $('#wizardDetail').on('click', '.this-spell-book', STORE, handleSpellBook);

  // spell book related listeners
  $('#allWizards').on('click', '.this-spell-book', STORE, handleSpellBook);
  $('#spell-book-section').on('click', '.spell-book-wizards-detail', STORE, handleSpellBookWizardDetails);
  $('#spell-book-section').on('click', '.spell-book-compendium-search', STORE, handleCompendium);
  $('#spell-book-section').on('click', '.see-spell-book-details', STORE, handleSpellBookDetails);
  $('#spell-book-section').on('click', '.spell-prepared-toggle', STORE, handleSpellPreparedToggle);
  $('#spell-book-section').on('click', '.spell-book-remove', STORE, handleSpellBookRemove);
  $('#spell-book-detail').on('click', '.my-spell-book', STORE, handleSpellBook);


  // nav bar listeners
  $(document).on('click', '.viewWizards', STORE, handleViewWizards);
  // $(document).on('click', '.viewSpellSearch', STORE, handleViewCompendium);
  $(document).on('click', '.viewHome', STORE, handleViewHome);

  // start app by viewing the home page
  // $('#search').trigger('submit');
  $('.viewHome').trigger('click');
});
