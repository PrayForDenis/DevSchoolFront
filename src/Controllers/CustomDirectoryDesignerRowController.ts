import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";
import { ICustomDirectoryDesignerRowData } from "../Models/ICustomDirectoryDesignerRowData";

export class CustomDirectoryDesignerRowController {
    constructor(private services: $RequestManager) { }

    public GetDirectoryDesignerRowData(cityId: string) : Promise<ICustomDirectoryDesignerRowData> {
        let url = urlStore.urlResolver.resolveUrl("GetDirectoryDesignerRowData", "CustomDirectoryDesignerRow");
        let data = {
            cityId: cityId
        }
        return this.services.requestManager.post(url, JSON.stringify(data));
    }
}

export type $CustomDirectoryDesignerRowController = { CustomDirectoryDesignerRowController: CustomDirectoryDesignerRowController }
export const $CustomDirectoryDesignerRowController = serviceName((s: $CustomDirectoryDesignerRowController) => s.CustomDirectoryDesignerRowController)