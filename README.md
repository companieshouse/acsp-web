# acsp-web

This is a web frontend for the Authorized Corporate Service Providers (ACSP). It was created based on [Typescript Web Starter for Companies House](https://github.com/companieshouse/node-review-web-starter-ts). 
For the corresponding API component, see [acsp-api]([(https://github.com/companieshouse/acsp-api)).

The documentation of the project is available on [Confluence](https://companieshouse.atlassian.net/wiki/spaces/IDV/pages/4213178415/Workstream+5+ACSPs).

This repository contains the following web applications:

### Apply to register as a Companies House authorised agent:
[http://chs.local/register-as-companies-house-authorised-agent](http://chs.local/register-as-companies-house-authorised-agent)


### View and update the authorised agent's details 
(Must be a registered ACSP to access this service):

[http://chs.local/register-as-companies-house-authorised-agent](http://chs.local/view-and-update-the-authorised-agents-details)


### Close the authorised agent account 
(Must be a registered ACSP to access this service):

[http://chs.local/close-authorised-agent](http://chs.local/close-authorised-agent)

## Frontend technologies and utils

- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Jest](https://jestjs.io)
- [SuperTest](https://www.npmjs.com/package/supertest)
- [Git](https://git-scm.com/downloads)

## Installing and running

### Requirements

1. node v20 (engines block in package.json is used to enforce this)
2. npm v10 (engines block in package.json is used to enforce this)

Having cloned the project into the working directory, run the following commands:

```shell
cd acsp-web
npm install
make clean build
```

### SSL set-up

If you wish to work with ssl-enabled endpoints locally, ensure you turn the `NODE_SSL_ENABLED` property to `ON` in the config and also provide paths to your private key and certificate.

### Running the app locally

Running the app will require the use of [companieshouse/docker-chs-development](https://github.com/companieshouse/docker-chs-development) (private repo) to bootstrap the necessary environment. Once set up, you can enable the service like so:

```shell
chs-dev modules enable acsp
chs-dev services enable acsp-web
```

If you also want to enable development mode (debugging & hot reload):

```shell
chs-dev development enable acsp-web
```

To start the application, run:

```shell
chs-dev up
```

...and navigate to one of the following web services:

### Register as an ACSP: 
[http://chs.local/register-as-companies-house-authorised-agent](http://chs.local/register-as-companies-house-authorised-agent) (or whatever hostname/port number combination you've changed the config values to)

### Update ACSP Details: 
[http://chs.local/register-as-companies-house-authorised-agent](http://chs.local/register-as-companies-house-authorised-agent) (or whatever hostname/port number combination you've changed the config values to)

### Close ACSP Account: 
[http://chs.local/close-authorised-agent](http://chs.local/close-authorised-agent) (or whatever hostname/port number combination you've changed the config values to)

For SSL connections, navigate to https://localhost:3443

### Running the Tests

To run all tests, use the following command:

```shell
npm run test
```

To get a test coverage report, run:

```npm run test:coverage```

This will also generate a html coverage report for all tests within this repository, which can be viewed through the following project path (simply drag and drop the file onto your preferred web browser:

```acsp-web/coverage/lcov-report/index.html```

# Configuration

System properties for the `acsp-web`. These are normally configured per environment.

Variable| Description                                                                           |
-------------------|---------------------------------------------------------------------------------------|
ACCOUNT_URL| URL for CHS account |
API_URL| API base URL for service interaction |
TRANSACTIONS_API_URL| API base URL for the Registration transaction |
CACHE_SERVER| Name of the cache |
CDN_HOST| URL for the CDN |
CDN_URL_CSS| CDN URL for the CSS |
CDN_URL_JS| CDN URL for the JavaScript |
CHS_INTERNAL_API_KEY| API key for CHS service |
CHS_URL| Host URL for CHS |
COOKIE_DOMAIN| Domain for cookies |
COOKIE_NAME| Name for the cookie |
COOKIE_SECRET| Used for cookie encryption |
FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS| Feature flag for enabling Update ACSP details web service |
FEATURE_FLAG_ENABLE_CLOSE_ACSP| Feature flag for enabling Close ACSP account web service |
HUMAN_LOG| Whether to produce a human-readable "pretty" log (1 or 0) |
LOG_LEVEL| Logging Level |
NODE_SSL_ENABLED| Flag to enable SSL for the server|
NUNJUCKS_LOADER_NO_CACHE| Flag to control the caching of templates in the Nunjucks loader|
NUNJUCKS_LOADER_WATCH| Flag to enable or disable watching for file changes in the Nunjucks loader |
PIWIK_URL| Link to the matomo dashboard |
PIWIK_SITE_ID| Matomo Site Id represents the environment |
PIWIK_CHS_DOMAIN| Domain URL for Matomo tracking used within the CSP |
PIWIK_REGISTRATION_START_GOAL_ID| Goal Id for the Registration start button used by matomo |
PIWIK_REGISTRATION_LC_ID| Goal Id for the Limited Company journey type used by matomo |
PIWIK_REGISTRATION_LP_ID| Goal Id for the Limited Partnership journey type used by matomo |
PIWIK_REGISTRATION_LLP_ID| Goal Id for the Limited Liability Partnership journey type used by matomo |
PIWIK_REGISTRATION_PARTNERSHIP_ID| Goal Id for the Partnership journey type used by matomo |
PIWIK_REGISTRATION_SOLE_TRADER_ID| Goal Id for the Sole Trader journey type used by matomo |
PIWIK_REGISTRATION_UNINCORPORATED_ID| Goal Id for the Unincorporated journey type used by matomo |
PIWIK_REGISTRATION_CORPORATE_BODY_ID| Goal Id for the Corporate Body journey type used by matomo |
PIWIK_REGISTRATION_CHECK_YOUR_ANSWERS_ID| Goal Id for the Check your answers continue to payment button used by matomo |
PIWIK_UPDATE_ACSP_START_GOAL_ID| Goal Id for the Update ACSP Details start button used by matomo |
PIWIK_CLOSE_ACSP_START_GOAL_ID| Goal Id for the Close ACSP Account start button used by matomo |