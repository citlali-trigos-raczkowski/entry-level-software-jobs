## Welcome to Entry Level Software Jobs
This is a simple application which fetches the latest Github Jobs postings on a scheduled interval, filters out non-entry-level positions, and displays them in a simple UI. This has been a really fun learning experience!

What I'm using for this simple application is replicable in any CRUD (Create, read, upload, delete) application. I'm using the following:
- a single datafeed - calling the public Gihub Jobs API
- in-memory storage - Redis Data Store 
- worker making an async call on an interval -- i.e. batch processing using a node worker on Cron 
- API called by a front-end

In this case, the project only reading from the front-end, but the back-end has a filter algorithm which removes non-entry-level job postings. 

### Backend 
I'm using an express.js server -- a web framework for node.js, alows us to create and expose API's to communicate with the client.

How do I ensure we are viewing the latest and greatest set of Github job positings? Everytime there's an update to the public [Github Jobs API](https://jobs.github.com/positions.json), do we need to fetch, run the same alg manually, and re-display them in the UI? Nope. This is why we use a cron (a time-based job scheduler) to make calls to get the updated jobs in a schedule you define. For this project, I have defined cron to call our "fetching functions" every minute, and store them using redis -- an in-memory data structure store which is used as a database or cache. This way we don't have to build a database. More info on cron [here](https://crontab.guru/#*_*_*_*_*) and redis [here](https://redis.io/).

I'm using a really simple algorithm to filter through the jobs received and remove non-entry level positions. Whenever a cron job returns jobs and stores them in redis, the algorithm removes any positions (case-insensitive) with titles including: Sr., Senior, or Manager.

### Frontend 

The jobs we receive from the back-end are displayed in a paginated list format. The front-end uses [Create-React-App](https://reactjs.org/docs/create-a-new-react-app.html) and [Material UI](https://material-ui.com/) for styling.

Each job displays:
- title
- company
- location of the job 
- time posted 

When a job is clicked, a modal opens up with more info:
- company logo
- full description
- application link

Additionally on the page itself, we have 
- ability to paginate for a selection of 10, 25, or 30 jobs 
- auto-scroll up for page transition 
- fuzzy search via [fuse.js](https://fusejs.io/)
- toggle for remote jobs only 

## Running Locally 

To run locally, you have to start up both the client and the worker.

To start the frontend (client), enter the `client` folder and start with `yarn`: 
``` from entry-level-software-jobs/
cd client && yarn serve
```
If you know go to `localhost:3000`, you can view the UI. It won't however display jobs until you begin fetching them from github, which the backend does. 

In another terminal window, start the backend by serving the api.
``` from entry-level-software-jobs/
node api
```
This command automatically accesses and runs the `index.js` file in `api/` which listens on port `3001` and allows the worker to begin fetching jobs on an interval.

Now return to `localhost:3000` and you can view openings in the UI! 

## Features for Improval 
First, this application is currently only reading from the public Github Jobs API. By accessing and using more job listings, the pool of jobs will be greatly increased. 

Second, the algorithm currently used is pretty basic. Filtering out by more fields than just the title will help accuracy. 

UI features we can add:
[x] set number of jobs per page x
[x] fuzzy search 
[ ] change color theme 
[ ] testing 
[ ] description/ link to repo on page 


work on: 
- remote toggle going off 
- deployment :) 
