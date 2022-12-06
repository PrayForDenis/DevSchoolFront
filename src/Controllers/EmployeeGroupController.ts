import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";

export class EmployeeGroupController {
    constructor(private services: $RequestManager) { }

    public GetEmployeeGroup(groupName: string) : Promise<GenModels.EmployeeDataModel[]> {
        let url = urlStore.urlResolver.resolveUrl("GetEmployeeGroup", "EmployeeGroup");
        let data = {
            groupName: groupName
        }
        return this.services.requestManager.post(url, JSON.stringify(data));
    }
}

export type $EmployeeGroupController = { EmployeeGroupController: EmployeeGroupController }
export const $EmployeeGroupController = serviceName((s: $EmployeeGroupController) => s.EmployeeGroupController)