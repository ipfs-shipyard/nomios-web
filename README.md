# nomios-web
This repository holds the codebase for the web version of Nomios, a reference implementation of the IDM Wallet UI.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.   
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.   
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.   
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.   
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint`

Runs ESlint and Stylelint on the project.   
Please run npm run lint -- -h for more options.

### `npm run release`

We use conventional commit messages. When running this command it will run [**standard-version**](https://github.com/conventional-changelog/standard-version) that does the following:

1. Bump the version in package.json (based on your commit history)
2. Uses conventional-changelog to update CHANGELOG.md
3. Commits package.json and CHANGELOG.md
4. Tags a new release

And after the tagging step, it will run `git push --follow-tags origin master` and deploy.

### `npm run deploy`

```sh
$ npm run deploy
```

Deploy the website to the `gh-pages` branch, updating `https://demo.nomios.io`. Note that it might take a few minutes to update the website due to caching. Alternatively, you may purge the cache manually in CloudFlare.
