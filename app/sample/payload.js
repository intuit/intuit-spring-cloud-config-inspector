const sample =
{
  "absoluteZero": "true",
  "app": {
    "color": "red",
    "enabled": "true",
    "features": {
      "absoluteZero": true,
      "currentPrice": "800.00"
    },
    "name": "Spring Cloud Config Client Demo",
    "settings": {
      "color": "red",
      "dbPassword": "{secret}idps:/spring_cloud_config_reference/db/password",
      "enabled": false,
      "env": "qal",
      "fullName": "Spring Cloud Config Reference Service",
      "phoneNumber": "(888)123-4567"
    }
  },
  "env": "qa",
  "onboarding": {
    "manager": {
      "github": {
        "api": {
          "orgUri": "https://github.intuit.com/api/v3/orgs/{org}?access_token={token}",
          "repoUri": "https://github.intuit.com/api/v3/repos/{owner}/{repo}?access_token={token}",
          "reposUri": "https://github.intuit.com/api/v3/orgs/{org}/repos?access_token={token}",
          "userOrgsUri": "https://github.intuit.com/api/v3/user/orgs?access_token={token}",
          "userUri": "https://github.intuit.com/api/v3/user?access_token={token}"
        },
        "auth": {
          "accessTokenUri": "https://github.intuit.com/login/oauth/access_token?code={code}&client_id=07124fb2441a4302e4f1&client_secret=f4af605f9c402836f96274cb698993c7f2a3af1c",
          "authoriseUri": "https://github.intuit.com/login/oauth/authorize?scope=user%20repo&client_id=07124fb2441a4302e4f1",
          "clientId": "07124fb2441a4302e4f1",
          "clientSecret": "f4af605f9c402836f96274cb698993c7f2a3af1c"
        }
      }
    }
  },
  "shipit": "true",
  "total": "nice"
}

export default sample
