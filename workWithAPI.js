async function loadAllTyps() {
    let url = 'https://pokeapi.co/api/v2/type';
    let response = await fetch(url);
    currendPokemon = await response.json();

    for (let i = 0; i < currendPokemon.count; i++) {
        allTypes.push(currendPokemon.results[i].name);
    }
    console.log(allTypes);
}

async function loadAllNames() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=1500';


    let response = await fetch(url);
    allPokemonNames = await response.json();

    console.log(allPokemonNames);
    console.log(allPokemonNames.results[0].name);

    let allNames = document.getElementById('allNames');
    for (let i = 0; i < allPokemonNames.results.length; i++) {
        const pokemon = allPokemonNames.results[i];
        allNames.innerHTML += `<div>${pokemon.name}</div>`;
    }
}