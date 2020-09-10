var CronJob = require("cron").CronJob;
const fetchGithub = require("./tasks/fetch-github");
// https://crontab.guru/#*_*_*_*_*

new CronJob("* * * * *", fetchGithub, null, true, "America/Los_Angeles");
