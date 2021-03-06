/* tslint:disable:no-console */
process.env.JUPITERONE_RUNTIME_ENVIRONMENT = 'LOCAL';

import { executeIntegrationLocal } from '@jupiterone/jupiter-managed-integration-sdk';
import { stepFunctionsInvocationConfig } from '../src/index';

const integrationConfig = {
  oktaApiKey: process.env.OKTA_LOCAL_EXECUTION_API_KEY,
  oktaOrgUrl: process.env.OKTA_LOCAL_EXECUTION_ORG_URL,
};

const invocationArgs = {
  // providerPrivateKey: process.env.PROVIDER_LOCAL_EXECUTION_PRIVATE_KEY
};

executeIntegrationLocal(
  integrationConfig,
  stepFunctionsInvocationConfig,
  invocationArgs,
).catch((err) => {
  console.error(err);
  process.exit(1);
});
