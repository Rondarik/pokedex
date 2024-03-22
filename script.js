let allLoadedPokemons = [];
let currendPokemon = [];
let allPokemonNames = [];
const typeColor =['#A4ACAF', '#D56723', '#3DC7EF', '#B87FC8', '#AB9842', '#808080', '#729F3F', '#7B62A3', '#9EB7B8', '#FD7D24', '#4592C4', '#9BCC50', '#EED535', '#F366B9', '#51C4E7', '#F16E57', '#707070', '#FDB9E9', '#82ABAF', '#3D71A4', ];
const allTypes = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass',          'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'unknown', 'shadow'];
let currentID = 1;

async function init() {
    // await loadPokemonByName();
    await loadPokemonByID(currentID);
    // await loadAllNames();
    getMainAttributes();
}

async function loadPokemonByName() {
    let url = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';
    let response = await fetch(url);
    currendPokemon = await response.json();

    console.log(currendPokemon);
}

function getMainAttributes() {
    let name = currendPokemon.name;
    let svgImg = getBigImage(getPokemonID());
    let PokeName = document.getElementById('PokemonName');
    let pokeImg = document.getElementById('pokemonImg')

    PokeName.innerHTML = name.charAt(0).toUpperCase() + name.slice(1); // first letter uppercase
    pokeImg.innerHTML = /*html */ `
        <img src= ${svgImg}>
    `;
    getPokemonTypes();
    setBGColorByType();
}

function getPokemonTypes() { // returns first Type
    let types = currendPokemon.types;
    document.getElementById('pokeTypes').innerHTML = '';

    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        document.getElementById('pokeTypes').innerHTML += /*html */`
              <div class="poke_type_fire">${type}</div>
        `;
    }
    return types[0].type.name;
}

function setBGColorByType() {
    let pokedexBG = document.getElementById('pokedex');
    let typeName = getPokemonTypes();
    let findIndex = allTypes.indexOf(typeName);

    pokedexBG.style.backgroundColor = typeColor[findIndex];
}

function getPokemonID() {
    let pokemonID = currendPokemon.id;
    document.getElementById('pokeID').innerHTML = "#" + pokemonID;
    return pokemonID;
}

function getBigImage(ID) {
    return currendPokemon.sprites.other["official-artwork"].front_default;
}

async function loadPokemonByID(ID) {
    let url = `https://pokeapi.co/api/v2/pokemon/${ID}`;
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



