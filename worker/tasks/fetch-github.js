var fetch = require('node-fetch');
var redis = require("redis"),
    client = redis.createClient();

const {promisify} = require('util');
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json'

async function fetchGithub() {
  let resultCount = 1,
    onPage = 0;
  const allJobs = [];

  // fetch all pages
  while (resultCount > 0) {
    const res = await fetch(`${baseURL}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    resultCount = jobs.length;
    console.log("got ", jobs.length, " jobs\n");
    onPage++;
  }

  // filter our non-junior positions 
  const juniorJobs = allJobs.filter(job => {
      const jobTitle = job.title.toLowerCase();
      if (
        jobTitle.includes('manager') || 
        jobTitle.includes('senior') || 
        jobTitle.includes('sr.') ||
        jobTitle.includes('architect') ) {
            return false
        }
      return true;
  })
  console.log("got ", allJobs.length, " total jobs\n", 'filtered down to ', juniorJobs.length);
  const success = await setAsync('githubJobs', JSON.stringify(juniorJobs));
  console.log('junior jobs: ', {success});
}

module.exports = fetchGithub;


// to run this page: node worker/tasks/fetch-github.js
// to view fullJobs: open up the redis-cli ("redis-cli" in command line), and then run "get githubJobs"