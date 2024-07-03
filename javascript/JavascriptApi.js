const searchFormName = document.getElementById('searchFormName');
const searchInputName = document.getElementById('searchInputName');
const searchFormType = document.getElementById('searchFormType');
const searchInputType = document.getElementById('searchInputType');
const resultName = document.getElementById('resultName');
const resultType = document.getElementById('resultType');

searchFormName.addEventListener('submit', function(e) {
    e.preventDefault();
    const pokemonName = searchInputName.value.toLowerCase();
    fetchPokemonByName(pokemonName);
});

searchFormType.addEventListener('submit', function(e) {
    e.preventDefault();
    const pokemonType = searchInputType.value.toLowerCase();
    fetchPokemonByType(pokemonType);
});

function fetchPokemonByName(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(response => response.json())
        .then(data => {
            resultName.innerHTML = `
                <div class="pokemon-card">
                    <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p>Altura: ${data.height / 10} m</p>
                    <p>Peso: ${data.weight / 10} kg</p>
                    <p>Tipos: ${data.types.map(type => type.type.name).join(', ')}</p>
                </div>
            `;
        })
        .catch(error => {
            resultName.innerHTML = `<p>No se encontró el Pokémon "${name}"</p>`;
        });
}

function fetchPokemonByType(type) {
    fetch(`https://pokeapi.co/api/v2/type/${type}`)
        .then(response => response.json())
        .then(data => {
            const pokemonList = data.pokemon.slice(0, 5); // Limito la lista para mostrar 5 nomas 
            const pokemonPromises = pokemonList.map(p => fetch(p.pokemon.url).then(res => res.json()));
            
            Promise.all(pokemonPromises)
                .then(pokemonData => {
                    resultType.innerHTML = pokemonData.map(pokemon => `
                        <div class="pokemon-card">
                            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                            <p>Altura: ${pokemon.height / 10} m</p>
                            <p>Peso: ${pokemon.weight / 10} kg</p>
                        </div>
                    `).join('');
                });
        })
        .catch(error => {
            resultType.innerHTML = `<p>No se encontraron Pokémon del tipo "${type}"</p>`;
        });
}