let allLoadedPokemons = [];
const countOfPokePile = 24;
let amountOfLoadedPokemons = countOfPokePile;
let offsetOfLoadedPokemons = 0;
let loadedPokemons = [];
let currendPokemon = [];
let allPokemonNames = [];
const typeColor = ['#A4ACAF', '#D56723', '#3DC7EF', '#B87FC8', '#AB9842', '#808080', '#729F3F', '#7B62A3', '#9EB7B8', '#FD7D24', '#4592C4', '#9BCC50', '#EED535', '#F366B9', '#51C4E7', '#F16E57', '#707070', '#FDB9E9', '#82ABAF', '#3D71A4',];
const allTypes = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'unknown', 'shadow'];
let currentID = 1;

async function init() {
    // await loadPokemonByName();
    // await loadPokemonByID(currentID);
    // await loadAllNames();
    getNextPokemonPile();
    // getMainAttributes();
}

// async function loadPokemonPile() {
//     let url = `https://pokeapi.co/api/v2/pokemon?limit=${amountOfLoadedPokemons}&offset=${offsetOfLoadedPokemons}`;
//     let response = await fetch(url);
//     loadedPokemons = await response.json();

//     allLoadedPokemons = loadedPokemons.results;

//     console.log(loadedPokemons);
//     console.log(allLoadedPokemons);
// }

async function getNextPokemonPile() {
    for (let i = 0; i < countOfPokePile; i++) {
        allLoadedPokemons.push(await loadPokemonByID(offsetOfLoadedPokemons + (i + 1))); //ID starts at 1
    }
    renderPokemonOverview();
    offsetOfLoadedPokemons += countOfPokePile;

}

async function loadPokemonByID(ID) {
    let url = `https://pokeapi.co/api/v2/pokemon/${ID}`;
    let response = await fetch(url);
    return await response.json();
}

function renderPokemonOverview() {
    let content = document.getElementById('mainContentID');

    for (let i = 0; i < countOfPokePile; i++) {
        content.innerHTML += renderOverviewHTML(offsetOfLoadedPokemons + i);
        setBGColorByType(offsetOfLoadedPokemons + i);
    }
    console.log(allLoadedPokemons[0]);
}

function renderOverviewHTML(index) {
    let name = allLoadedPokemons[index].name;
    name = name.charAt(0).toUpperCase() + name.slice(1);// first letter uppercase
    let img = getPokemonImage(index);
    return /*html*/ `
         <div class="poke_box" id="pokeBox${index}" onclick="showOverlay(${index})">
                <div class="poke_box_header">
                    <div id="pokeBoxName">${name}</div>
                    <div id="pokeBoxId">#${index + 1}</div>
                </div>
                <div class="poke_box_content">
                    <div class="" id="pokeBoxTypes${index}">
                    </div>
                    <img src="${getPokemonImage(index)}">
                </div>
            </div>
    `;
}

function getPokemonImage(index) {
    return allLoadedPokemons[index].sprites.other["official-artwork"].front_default;
}

function getPokemonTypes(div, index) {
    // let container = document.getElementById(`pokeBoxTypes${index}`);
    let container = document.getElementById(`${div}${index}`);
    let types = allLoadedPokemons[index].types;
    setPokemonTypes(index, container);

    return types[0].type.name;
}

function setPokemonTypes(index, container) {
    let types = allLoadedPokemons[index].types;
    for (let i = 0; i < types.length; i++) {
        const typeName = types[i].type.name;
        container.innerHTML += /*html*/ `
            <div class="poke_type_fire">${typeName}</div>
            <!-- <div class="poke_type_fire">Name</div> -->
        `;
    }
}

function setBGColorByType(index) {
    let pokedexBG = document.getElementById(`pokeBox${index}`);
    let typeName = getPokemonTypes('pokeBoxTypes',index);
    let findIndex = allTypes.indexOf(typeName);

    pokedexBG.style.backgroundColor = typeColor[findIndex];
}

function showOverlay(index) {
    let overlay = document.getElementById('overlayID');
    overlay.classList.remove('d-none');

    getMainAttributes(index);
    console.log(index + 1);
}

function getMainAttributes(index) {
    let name = allLoadedPokemons[index].name;
    let PokeName = document.getElementById('PokemonNameID');
    let pokeImg = document.getElementById('pokemonImgID');
    let pokeID = document.getElementById('pokeID');
    let poketype = document.getElementById( 'pokeTypesID');

    PokeName.innerHTML = name.charAt(0).toUpperCase() + name.slice(1); // first letter uppercase
    pokeID.innerHTML = '#' + (index + 1);
    pokeImg.innerHTML = /*html */ `
        <img src="${getPokemonImage(index)}">
    `;
    setPokemonTypes(index, poketype);
    setBGColorByType(index);
}





function getPokemonID() {
    let pokemonID = currendPokemon.id;
    document.getElementById('pokeID').innerHTML = "#" + pokemonID;
    return pokemonID;
}

async function loadPokemonByName() {
    let url = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';
    let response = await fetch(url);
    currendPokemon = await response.json();

    console.log(currendPokemon);
}



async function nextPokemon() {
    currentID++;
    await loadPokemonByID(currentID);
    getMainAttributes();
}
async function prevPokemon() {
    currentID--;
    await loadPokemonByID(currentID);
    getMainAttributes();
}



