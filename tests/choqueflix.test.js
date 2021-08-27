const { it, test } = require('@jest/globals');

async function getTrailerLink() {
  const data = await fetch();
  const json = await data.json();
    const trailerType = (json.results) ?
      (json.results.find(({ type }) => type === 'Trailer')) : false;
    if (trailerType) {
      const trailerLink = `https://www.youtube.com/watch?v=${trailerType.key}`;
      return trailerLink;
    }
}

const fetch = require('node-fetch');

jest.mock('node-fetch');

const expectedObj = {
  results: [{
    "adult": false,
    "genres": [
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 28,
        "name": "Action"
      }
    ],
    "id": 451048,
    "original_language": "en",
    "original_title": "Jungle Cruise",
    "overview": "Dr. Lily Houghton enlists the aid of wisecracking skipper Frank Wolff to take her down the Amazon in his dilapidated boat. Together, they search for an ancient tree that holds the power to heal – a discovery that will change the future of medicine.",
    "popularity": 3406.403,
    "poster_path": "/9dKCd55IuTT5QRs989m9Qlb7d2B.jpg",
    "revenue": 173743828,
    "title": "Jungle Cruise",
    "key": "hJZ82pwwJqA",
    "type": "Trailer",
    "vote_average": 7.9,
    "vote_count": 2087
  }]
};

const expectedLink = `https://www.youtube.com/watch?v=hJZ82pwwJqA`;

describe('Testa todas as requisições de Api:', () => {
  
  it('Verifica se retorna um objeto com a propriedade "Trailer".', async () => {
    
    fetch.mockImplementation(async () => {
      return {
        json: async () => {
          return expectedObj;
        }
      }
    });

    const linkReturned = await getTrailerLink();
    expect(linkReturned).toEqual(expectedLink);
    expect.assertions(1);
  })
});

it('sei lá', () => {
  expect(2 + 2).toBe(4);
})