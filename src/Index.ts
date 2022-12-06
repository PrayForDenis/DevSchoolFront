import * as EventHandlers from "./EventHandlers";
import { extensionManager } from "@docsvision/webclient/System/ExtensionManager";
import { Service } from "@docsvision/webclient/System/Service";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { $CustomEmployeeDataController, CustomEmployeeDataController } from "./Controllers/CustomEmployeeDataController";
import { $CustomDirectoryDesignerRowController, CustomDirectoryDesignerRowController } from "./Controllers/CustomDirectoryDesignerRowController";
import { $TicketPriceFromApiController, TicketPriceFromApiController } from "./Controllers/TicketPriceFromApiController";
import { $EmployeeGroupController, EmployeeGroupController } from "./Controllers/EmployeeGroupController";
import { $ChangeStateToApprovalController, ChangeStateToApprovalController } from "./Controllers/ChangeStateToApprovalController";


// Главная входная точка всего расширения
// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
// чтобы rollup смог собрать их все в один бандл.

// Регистрация расширения позволяет корректно установить все
// обработчики событий, сервисы и прочие сущности web-приложения.
extensionManager.registerExtension({
    name: "DevSchoolFront",
    version: "5.5.16",
    globalEventHandlers: [ EventHandlers ],
    layoutServices: [
        Service.fromFactory($CustomEmployeeDataController, (services: $RequestManager) => new CustomEmployeeDataController(services)),
        Service.fromFactory($CustomDirectoryDesignerRowController, (services: $RequestManager) => new CustomDirectoryDesignerRowController(services)),
        Service.fromFactory($TicketPriceFromApiController, (services: $RequestManager) => new TicketPriceFromApiController(services)),
        Service.fromFactory($EmployeeGroupController, (services: $RequestManager) => new EmployeeGroupController(services)),
        Service.fromFactory($ChangeStateToApprovalController, (services: $RequestManager) => new ChangeStateToApprovalController(services))
    ]
})