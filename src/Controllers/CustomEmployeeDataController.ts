import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";
import { ICustomEmployeeData } from "../Models/ICustomEmployeeData";

export class CustomEmployeeDataController {
    constructor(private services: $RequestManager) { }

    public GetEmployeeData(employeeId: string) : Promise<ICustomEmployeeData> {
        let url = urlStore.urlResolver.resolveUrl("GetEmployeeData", "CustomEmployeeData");
        let data = {
            employeeId: employeeId
        }
        return this.services.requestManager.post(url, JSON.stringify(data));
    }
}

export type $CustomEmployeeDataController = { CustomEmployeeDataController: CustomEmployeeDataController }
export const $CustomEmployeeDataController = serviceName((s: $CustomEmployeeDataController) => s.CustomEmployeeDataController)