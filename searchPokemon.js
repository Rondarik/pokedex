let allLoadedPokemonNames = [];
let loadedSearchedPokemons = [];
let searchIsAktiv = false;

// Search Pokemon
function searchForPokemon() {
    loadedSearchedPokemons = [];
    currentJson = loadedSearchedPokemons;
    searchIsAktiv = true;
    document.getElementById('mainContainerID').classList.add('d-none');
    document.getElementById('searchContainerID').classList.remove('d-none');
    let searchBtn = document.getElementById('searchBtnID');
    searchBtn.style.pointerEvents = 'none'; // stop Button geting more loads from API
    checkInput();
    searchBtn.style.pointerEvents = 'all'; // allow Button geting more loads from API
}

function checkInput() {
    let searchInput = document.getElementById('searchInputID').value.toLowerCase();
    document.getElementById('searchInputID').value = '';
    if (searchInput !== '') {
        if (isNaN(searchInput)) {
            searchPokemonByName(checkStringInput(searchInput));
        } else {
            searchPokemonsByID(searchInput);
        }
    } else {
        sendError();
    }
}

function filterNames() {
    let searchInput = document.getElementById('searchInputID').value.toLowerCase();
    searchInput = searchInput.toLowerCase();
}

function checkStringInput(searchInput) {
    if (searchInput.length >= 3) {
        return searchInput;
    } 
}

function backFromSearch() {
    currentJson = allLoadedPokemons;
    searchIsAktiv = false;
    document.getElementById('mainContainerID').classList.remove('d-none');
    document.getElementById('searchContainerID').classList.add('d-none');
    renderPokemonOverview()
}

async function searchPokemonByName(searchInput) {
    let names = [];
    for (let i = 0; i < allLoadedPokemonNames.results.length; i++) {
        const name = allLoadedPokemonNames.results[i].name.toLowerCase();
        if (name.includes(searchInput)) {
            names.push(allLoadedPokemonNames.results[i].name);
        }
    }
    await getPokemonsByNames(names);
    renderSearchedPokemon();
}

async function getPokemonsByNames(names) {
    for (let i = 0; i < names.length; i++) {
        await loadPokemonByName(names[i])
    }
}

async function searchPokemonsByID(searchInput) {
    if (checkNumberInput(searchInput)) {
    let id = Number(searchInput)
    loadedSearchedPokemons.push(await loadPokemonByID(id))
    renderSearchedPokemon();
   } else {
    sendError();
   }
}

function sendError() {
    let content = document.getElementById('searchContentID');
        content.innerHTML = /*html*/ `
            <div class="error_message">Pokémon not found. Type min 3 Letters or a number between 1-1025 or 10001-10277</div>
        `;
}

function checkNumberInput(searchInput) {
    if (searchInput >=0 && searchInput <=1025) {
        return true;
    } if (searchInput >=10001 && searchInput <=10277) {
        return true;
    }
    return false;

}

function findIdInUrl(url) {
    const cutedUrl = cutUrl(url);
    const match = cutedUrl.match(/\d+$/);
    return match ? parseInt(match[0]) : null;
}

function cutUrl(url) {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function getPokemonsByIDs(idsFromUrl) {
    for (let i = 0; i < idsFromUrl.length; i++) {
        const id = idsFromUrl[i];
        loadedSearchedPokemons.push(await loadPokemonByID(id));
    }
}

function renderSearchedPokemon() {
    let content = document.getElementById('searchContentID');
    content.innerHTML = '';
    checkSearchResult();
    for (let i = 0; i < loadedSearchedPokemons.length; i++) {
        let name = loadedSearchedPokemons[i].name;
        name = firstLetterUppercase(name);
        let img = loadedSearchedPokemons[i].sprites.other["official-artwork"].front_default;
        let id = loadedSearchedPokemons[i].id;
        content.innerHTML += renderSearchHTML(i, name, id, img);
        getSearchedPokemonTypes(i);
        setBGColorBySearchedType(i);
    }
}

function checkSearchResult() {
    if (loadedSearchedPokemons.length === 0) {
        sendError();
    }
}

function renderSearchHTML(index, name, id, img) {
    return /*html*/ `
         <div class="poke_box" id="pokeBoxSearch${index}" onclick="showOverlay(${index})">
                <div class="poke_box_header">
                    <div id="pokeBoxSearchName">${name}</div>
                    <div id="pokeBoxSearchId">#${id}</div>
                </div>
                <div class="poke_box_content">
                    <div class="" id="pokeBoxSearchTypes${index}">
                    </div>
                    <img src="${img}">
                </div>
            </div>
    `;
}

function getSearchedPokemonTypes(index) {
    let container = document.getElementById(`pokeBoxSearchTypes${index}`);
    let types = loadedSearchedPokemons[index].types;
    for (let i = 0; i < types.length; i++) {
        const typeName = types[i].type.name;
        container.innerHTML += /*html*/ `
            <div class="poke_type">${typeName}</div>
        `;
    }
}

function setBGColorBySearchedType(index) {
    let pokeboxBG = document.getElementById(`pokeBoxSearch${index}`);
    let typeName = loadedSearchedPokemons[index].types[0].type.name;
    let findIndex = allTypes.indexOf(typeName);
    pokeboxBG.style.backgroundColor = typeColor[findIndex];
}
