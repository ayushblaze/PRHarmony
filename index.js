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
    console.log("---- Notion Response ----");
    console.log(response);
  }
}

require("dotenv").config();
const fetch = require("node-fetch");
const { Octokit } = require("octokit");

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
  request: {
    fetch,
  }
});

const getPullRequests = async () => {
  const response = await octokit.request('GET /orgs/{org}/repos?type=private', {
    org: 'FieldAssist',
    headers: {
      'accept': 'application/vnd.github+json',
    }
  });

  // console.log(response.data);
  // console.log(response.data.length);

  const prs = await octokit.request('GET /repos/FieldAssist/fa_nestjs_dms_reporting_service/pulls', {
    owner: 'FieldAssist',
    repo: 'fa_nestjs_dms_reporting_service',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  // console.log(prs.data[0]);
  const prInfo = prs.data[0];
  const prData = {
    "url": prInfo.url,
    "number": prInfo.number,
    "state": prInfo.state,
    "title": prInfo.title,
    "author": prInfo.user.login,
    "body": prInfo.body,
    "createdAt": prInfo.created_at,
    "updateAt": prInfo.updated_at,
    "closedAt": prInfo.closed_at,
    "merged_at": prInfo.merged_at,
    "reviewers": prInfo.requested_reviewers,
  };
}

getPullRequests();

