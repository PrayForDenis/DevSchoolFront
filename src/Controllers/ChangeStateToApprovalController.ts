import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";

export class ChangeStateToApprovalController {
    constructor(private services: $RequestManager) { }

    public ChangeStateToApproval(cardId: string) : Promise<boolean> {
        let url = urlStore.urlResolver.resolveUrl("ChangeStateToApproval", "ChangeStateToApproval");
        let data = {
            cardId: cardId
        }
        return this.services.requestManager.post(url, JSON.stringify(data));
    }
}

export type $ChangeStateToApprovalController = { ChangeStateToApprovalController: ChangeStateToApprovalController }
export const $ChangeStateToApprovalController = serviceName((s: $ChangeStateToApprovalController) => s.ChangeStateToApprovalController)