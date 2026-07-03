const appJson = require('./app.json');

module.exports = () => ({
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      githubToken: process.env.EXPO_PUBLIC_GITHUB_TOKEN || undefined,
    },
  },
});
