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
  // console.log("------------------------------------");
  // console.log(prs);
  // console.log("------------------------------------");
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