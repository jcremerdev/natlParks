'use strict';

const apiKey = 'K09umUJ7ZvkudMZ8PML1yNUgpL2PP5JdHf2grx4h';
const baseUrl = 'https://developer.nps.gov/api/v1/parks'

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');   
}

function displayParks(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();

    for (let i = 0; i < responseJson.data.length; i++) {

        $('#results-list').append(
            `<li><h3>${responseJson.data[i].name}</h3>
            <p>${responseJson.data[i].url}</p>
            <p>${responseJson.data[i].description}</p>
            <img src='${responseJson.data[i].images[0].url}'>
            <p>${responseJson.data[i].images[0].title}</p>
            </li>`
        )
    }
    $('#results').removeClass('hidden');
}

function getParks(query, maxResults=10){
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit: maxResults
    };
    const queryString = formatQueryParams(params);
    const url = baseUrl + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayParks(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getParks(searchTerm, maxResults);
    });
}

$(watchForm);