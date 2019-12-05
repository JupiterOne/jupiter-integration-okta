import {
  IntegrationLogger,
  IntegrationStepIterationState,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { OktaExecutionContext } from "../types";
import retryIfRateLimited from "../util/retryIfRateLimited";
import fetchBatchOfResources from "./fetchBatchOfResources";
import {
  OktaApplication,
  OktaApplicationCacheData,
  OktaApplicationGroup,
  OktaClient,
  OktaQueryParams,
} from "./types";

export default async function fetchBatchOfApplications(
  executionContext: OktaExecutionContext,
  iterationState: IntegrationStepIterationState,
): Promise<IntegrationStepIterationState> {
  return fetchBatchOfResources({
    resource: "applications",
    executionContext,
    iterationState,
    pageLimitVariable: "OKTA_APPLICATIONS_PAGE_LIMIT",
    batchPagesVariable: "OKTA_APPLICATIONS_BATCH_PAGES",
    fetchCollection: (queryParams?: OktaQueryParams) =>
      executionContext.okta.listApplications(queryParams),
    fetchData: async (
      application: OktaApplication,
      okta: OktaClient,
      logger: IntegrationLogger,
    ): Promise<OktaApplicationCacheData> => {
      const applicationGroups: OktaApplicationGroup[] = [];

      const listApplicationGroups = await okta.listApplicationGroupAssignments(
        application.id,
      );
      await retryIfRateLimited(logger, () =>
        listApplicationGroups.each((group: OktaApplicationGroup) => {
          applicationGroups.push(group);
        }),
      );

      return {
        application,
        applicationGroups,
      };
    },
  });
}