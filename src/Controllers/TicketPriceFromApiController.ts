import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";

export class TicketPriceFromApiController {
    constructor(private services: $RequestManager) { }

    public GetTicketPriceFromAPI(airportCode: string, dateFrom: string, dateTo: string) : Promise<number> {
        let url = urlStore.urlResolver.resolveUrl("GetTicketPriceFromAPI", "TicketPriceFromApi");
        let data = {
            airportCode: airportCode,
            dateFrom: dateFrom,
            dateTo: dateTo
        }
        return this.services.requestManager.post(url, JSON.stringify(data));
    }
}

export type $TicketPriceFromApiController = { TicketPriceFromApiController: TicketPriceFromApiController }
export const $TicketPriceFromApiController = serviceName((s: $TicketPriceFromApiController) => s.TicketPriceFromApiController)