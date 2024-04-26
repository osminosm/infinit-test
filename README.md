# Inifinit Test

## Requirement

The goal is for you to write a program that connects via the GitHub API to the GitHub - lodash/lodash repository and gathers a couple of statistics for us.

We would like the program to output statistics on how often each letter is present in the JavaScript/TypeScript files of the repository, in decreasing order.

## Requirment breakdown

Write a program that:
- connects via the GitHub API to github repo (lodash)
- gathers/outputs how often each letter is present in the JavaScript/TypeScript files

### Connecting via the GitHub API to github repo 

Questions
What might "connect" mean ? ... anyways basically we need to get the file content to be able to look into them.

Github api research :

```
Possibilities on github api docs:
1 - fine grained aproach: fetch file list -> and query content file by file on the js/ts files to be processed
    Pros: uses github api / Cons: Overkill, there might be thousands of files to fetch, will we need to manage rate limiting ?  
2 - fetch a zip of the repo on a certain version and do the processing in bulk next 
    Pros: Simple / Cons: will download all repo files, depends on zip

```

### Charachter occurency stat

Needs repository js/ts file
- what version (branch/commit/tag?) -> configurable
- what about mjs or tsx -> configurable

Needs to count charater occurences for a file
- Load file into memory
- process file content (get the stats)
- aggregate results for the whole repository

