const MIME_TYPE = 'text/plain';

function main() {
  const state = {
    tabBar: document.getElementsByClassName('tab-bar')[0],
    tabsStore: new Map(),
    startX: 0,
    draggingElem: undefined,
    draggingImg: new Image(),
  };

  state.draggingImg.src = './thumbnail.png';
  state.draggingImg.addEventListener('load', () => {
    console.log('image is loaded');
  });

  state.tabBar.addEventListener('drop', (event) => {
    event.preventDefault();
    const { tabId, label } = deserializeObject(event.dataTransfer.getData(MIME_TYPE));
    if (state.tabsStore.has(tabId)) {
      console.log('tab from this bar');
      const movingTab = document.getElementById(tabId);
      movingTab.parentNode.removeChild(movingTab);
      state.tabBar.appendChild(movingTab);
    } else {
      console.log('tab from other bar');
      const newTab = createTab(state, tabId, label);
      state.tabBar.appendChild(newTab);
    }
  });

  state.tabBar.addEventListener('dragover', (event) => {
    console.log('tabBar', event.target.id);
    event.preventDefault();
    if (state.draggingElem == null) {
      return;
    }
    state.draggingElem.style.transform = `translate(${event.x - state.startX}px, 0px)`;
  });

  createTabs(state);
}

function createTabs(state) {
  const url = new URL(window.location.href);
  const tabs = document.createDocumentFragment();
  url.searchParams.forEach((label, tabId) => {
    state.tabsStore.set(tabId, label);
    const tab = createTab(state, tabId, label);
    tabs.appendChild(tab);
  });
  state.tabBar.appendChild(tabs);
}

function createTab(state, tabId, label) {
  const tab = document.createElement('div');
  tab.id = tabId;
  tab.textContent = label;
  tab.draggable = true;
  tab.classList.add('tab');
  tab.addEventListener('dragstart', (event) => {
    state.startX = event.x;
    state.draggingElem = document.getElementById(event.target.id);
    state.draggingElem.classList.add('moving');
    event.dataTransfer.setData(MIME_TYPE, serializeData({ tabId, label }));
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setDragImage(state.draggingImg, 0, 0);
  });
  tab.addEventListener('dragend', (event) => {
    event.dataTransfer.clearData(MIME_TYPE);
    state.draggingElem.classList.remove('moving');
    state.draggingElem.style.transform = ``;
    state.draggingElem = undefined;
  });
  return tab;
}

function serializeData(object) {
  return JSON.stringify(object);
}

function deserializeObject(string) {
  return JSON.parse(string);
}

main();
