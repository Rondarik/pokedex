let allLoadedPokemonNames = [];
let loadedSearchedPokemons = [];

// Search Pokemon
function searchForPokemon() {
    currentJson = loadedSearchedPokemons;
    document.getElementById('mainContainerID').classList.add('d-none');
    document.getElementById('searchContainerID').classList.remove('d-none');
    let searchInput = document.getElementById('searchInputID').value.toLowerCase();
    document.getElementById('searchInputID').value = '';
    let searchBtn = document.getElementById('searchBtnID');
    searchBtn.style.pointerEvents = 'none'; // stop Button geting more loads from API

    if (isNaN(searchInput)) {
        searchPokemonByName(searchInput);
    } else {
        searchPokemonsByID(searchInput);
    }
}

function filterNames() {
    let searchInput = document.getElementById('searchInputID').value.toLowerCase();
    searchInput = searchInput.toLowerCase();
}

function backFromSearch() {
    currentJson = allLoadedPokemons;
    document.getElementById('mainContainerID').classList.remove('d-none');
    document.getElementById('searchContainerID').classList.add('d-none');
}

async function searchPokemonByName(searchInput) {
    let searchBtn = document.getElementById('searchBtnID');
    let names = [];
    for (let i = 0; i < allLoadedPokemonNames.results.length; i++) {
        const name = allLoadedPokemonNames.results[i].name.toLowerCase();
        if (name.includes(searchInput)) {
            names.push(allLoadedPokemonNames.results[i].name);
        }
    }
    await getPokemonsByNames(names);
    renderSearchedPokemon();
    searchBtn.style.pointerEvents = 'all'; // allow Button geting more loads from API
}

async function getPokemonsByNames(names) {
    for (let i = 0; i < names.length; i++) {
        await loadPokemonByName(names[i])
    }
}

async function searchPokemonsByID(searchInput) {
    let idsFromUrl = [];

    for (let i = 0; i < allLoadedPokemonNames.results.length; i++) {
        const id = String(findIdInUrl(allLoadedPokemonNames.results[i].url));
        if (id.includes(searchInput)) {
            idsFromUrl.push(Number(id));
        }
    }
    await getPokemonsByIDs(idsFromUrl);
    renderSearchedPokemon();
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
