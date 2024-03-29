async function loadAllPokemonNames() {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0`;
    let response = await fetch(url);
    allLoadedPokemonNames = await response.json();
    numberOfAllPokemon = allLoadedPokemonNames.count;
}

async function loadPokemonByID(ID) {
    let url = `https://pokeapi.co/api/v2/pokemon/${ID}`;
    let response = await fetch(url);
    return await response.json();
}

async function loadPokemonByName(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    let currendPokemon = await response.json();
    loadedSearchedPokemons.push(currendPokemon);
}