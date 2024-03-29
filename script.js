const typeColor = ['#A4ACAF', '#D56723', '#3DC7EF', '#B87FC8', '#AB9842', '#808080', '#729F3F', '#7B62A3', '#9EB7B8', '#FD7D24', '#4592C4', '#9BCC50', '#EED535', '#F366B9', '#51C4E7', '#F16E57', '#707070', '#FDB9E9', '#82ABAF', '#3D71A4',];
const allTypes = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'unknown', 'shadow'];
const countOfPokePile = 24;
let offsetOfLoadedPokemons = 0;

let allLoadedPokemons = [];

let currentJson = [];
let currentIndex = 0;

async function init() {
    currentJson = allLoadedPokemons;
    await loadAllPokemonNames();
    await getNextPokemonPile();
}

async function getNextPokemonPile() {
    let moreButton = document.getElementById('getMoreBtnID');
    moreButton.style.pointerEvents = 'none'; // stop Button geting more loads from API
    for (let i = 0; i < countOfPokePile; i++) {
        allLoadedPokemons.push(await loadPokemonsByIndex(i));
    }
    renderPokemonOverview();
    offsetOfLoadedPokemons += countOfPokePile;
}

async function loadPokemonsByIndex(index) {
    ID = index + 1; //ID starts at 1
    if (ID > 1025) {
        ID = ID + 8975;
    }
    if (ID > 10277) {
        return
    }
    return await loadPokemonByID(offsetOfLoadedPokemons + (ID)); 
}

function renderPokemonOverview() {
    let content = document.getElementById('mainContentID');
    let moreButton = document.getElementById('getMoreBtnID');

    for (let i = 0; i < countOfPokePile; i++) {
        let index = i + offsetOfLoadedPokemons;
        let name = allLoadedPokemons[index].name;
        name = firstLetterUppercase(name);
        let img = getPokemonImage(index);
        let id = allLoadedPokemons[index].id;
        content.innerHTML += renderOverviewHTML(index, name, id, img);
        getPokemonTypes(index);
        setBGColorByType(false, index);
    }
    moreButton.style.pointerEvents = 'all'; // allow Button geting more loads from API
    checkButton();
}

function renderOverviewHTML(index, name, id, img) {
    return /*html*/ `
         <div class="poke_box" id="pokeBox${index}" onclick="showOverlay(${index})">
                <div class="poke_box_header">
                    <div id="pokeBoxName">${name}</div>
                    <div id="pokeBoxId">#${id}</div>
                </div>
                <div class="poke_box_content">
                    <div class="" id="pokeBoxTypes${index}">
                    </div>
                    <img src="${img}">
                </div>
            </div>
    `;
}

function firstLetterUppercase(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getPokemonImage(index) {
    return currentJson[index].sprites.other["official-artwork"].front_default;
}

function getPokemonTypes(index) {
    let container = document.getElementById(`pokeBoxTypes${index}`);
    let types = currentJson[index].types;
    for (let i = 0; i < types.length; i++) {
        const typeName = getPokemonType(index, i);
        container.innerHTML += /*html*/ `
            <div class="poke_type">${typeName}</div>
        `;
    }
}

function getPokemonTypesInOverlay(index) {
    let container = document.getElementById(`pokeTypesID`);
    container.innerHTML = '';
    let types = currentJson[index].types;
    for (let i = 0; i < types.length; i++) {
        const typeName = getPokemonType(index, i);
        container.innerHTML += /*html*/ `
            <div class="poke_type">${typeName}</div>
        `;
    }
}

function getPokemonType(index, i) {
    let types = currentJson[index].types;
    return types[i].type.name;
}

function setBGColorByType(fromOverlay, index) {
    let pokeboxBG = document.getElementById(`pokeBox${index}`);
    let pokedexBG = document.getElementById(`pokedex`);
    let typeName = getPokemonType(index, 0); // first type for color
    let findIndex = allTypes.indexOf(typeName);

    pokeboxBG.style.backgroundColor = typeColor[findIndex];
    (fromOverlay) ? pokedexBG.style.backgroundColor = typeColor[findIndex]
        : pokeboxBG.style.backgroundColor = typeColor[findIndex];
}

// ---------  Overlay ----------
function showOverlay(index) {
    document.getElementById('bodyID').style.overflow = 'hidden';
    let overlay = document.getElementById('overlayID');
    overlay.classList.remove('d-none');
    currentIndex = index;
    getMainAttributes(index);
    checkButton();
}

function closeOverlay() {
    document.getElementById('bodyID').style.overflow = 'scroll';
    let overlay = document.getElementById('overlayID');
    overlay.classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}

function checkEndOfLoadedPokemonJson(ID) {
    let arraySize = currentJson.length;
    if (ID === arraySize) {
        getNextPokemonPile();
    }
}

function getMainAttributes(index) {
    let name = currentJson[index].name;
    let id = currentJson[index].id;
    let PokeName = document.getElementById('PokemonNameID');
    let pokeImg = document.getElementById('pokemonImgID');
    let pokeID = document.getElementById('pokeID');

    PokeName.innerHTML = name.charAt(0).toUpperCase() + name.slice(1); // first letter uppercase
    pokeID.innerHTML = '#' + (id);
    pokeImg.innerHTML = /*html */ `
        <img src="${getPokemonImage(index)}">
    `;
    getPokemonTypesInOverlay(index);
    setBGColorByType(true, index);
    checkEndOfLoadedPokemonJson(index + 1);
    getPokemonStats(index);
}

function nextPokemon() {
    currentIndex++;
    checkButton();
    getMainAttributes(currentIndex);
}

function prevPokemon() {
    currentIndex--;
    checkButton();
    getMainAttributes(currentIndex);
}

function checkButton() {
    if (currentIndex === 0) {
        document.getElementById('prevPokemon').classList.add('d-none');
    } else if (currentIndex === (currentJson.length - 1)) {
        document.getElementById('nextPokemon').classList.add('d-none');
    } else {
        document.getElementById('prevPokemon').classList.remove('d-none');
        document.getElementById('nextPokemon').classList.remove('d-none');
    }
}

function getPokemonStats(ID) {
    let hp = currentJson[ID].stats[0].base_stat;
    let atk = currentJson[ID].stats[1].base_stat;
    let def = currentJson[ID].stats[2].base_stat;
    let spAtk = currentJson[ID].stats[3].base_stat;
    let spDef = currentJson[ID].stats[4].base_stat;
    let speed = currentJson[ID].stats[5].base_stat;
    rederStatsHTML(hp, atk, def, spAtk, spDef, speed);
}

function rederStatsHTML(hp, atk, def, spAtk, spDef, speed) {
    let container = document.getElementById('pokeInfoTable');
    container.innerHTML = /*html*/ `
        <tr>
            <td>Hitpoints</td>
            <td>${hp}</td>
        </tr>
        <tr>
            <td>Attack</td>
            <td>${atk}</td>
        </tr>
        <tr>
            <td>Defence</td>
            <td>${def}</td>
        </tr>
        <tr>
            <td>Special-attack</td>
            <td>${spAtk}</td>
        </tr>
        <tr>
            <td>Special-defence</td>
            <td>${spDef}</td>
        </tr>
        <tr>
            <td>Speed</td>
            <td>${speed}</td>
        </tr>
    `;
}