import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";

export interface ICustomEmployeeData {
    director: GenModels.EmployeeDataModel,
    phone: string,
    unit: GenModels.DepartmentModel
}