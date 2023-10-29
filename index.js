const axios = require("axios");
require("dotenv").config();
const { Client } = require("@notionhq/client");
const fetch = require("node-fetch");
const { Octokit } = require("octokit");

const notion = new Client({ auth: process.env.NOTION_KEY });
const pokeArray = [];

async function getPokemon() {
  await axios
    .get("https://pokeapi.co/api/v2/pokemon/4")
    .then((pokemon) => {
      console.log("-----------------------------------");
      const pokemonData = {
        "name": pokemon.data.species.name,
        "number": pokemon.data.id,
        "hp": pokemon.data.stats[0].base_stat,
        "weight": pokemon.data.weight,
        "height": pokemon.data.height,
        "attack": pokemon.data.stats[1].base_stat,
      };
      pokeArray.push(pokemonData);
      console.log(pokemonData);
    })
    .catch((err) => console.log(err));

    createNotionPage();
}

getPokemon();

async function createNotionPage() {
  for (let pokemon of pokeArray) {
    const response = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": process.env.NOTION_DB_ID
      },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": pokemon.name,
              }
            }
          ]
        },
        "Nature": {
          "rich_text": [
            {
                "text": {
                    "content": "NICE AF",
                }
            }
        ]
        }
      }
    });
    console.log("-------------------------------");
    console.log("---- Notion Response ----");
    console.log(response);
  }
}

