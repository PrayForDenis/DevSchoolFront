import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { $CardId } from "@docsvision/webclient/System/LayoutServices";
import { Layout } from "@docsvision/webclient/System/Layout";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { Numerator } from "@docsvision/webclient/BackOffice/Numerator";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { Employee } from "@docsvision/webclient/BackOffice/Employee";
import { $DepartmentController, $DirectoryDesignerRowController, $EmployeeController } from "@docsvision/webclient/Generated/DocsVision.WebClient.Controllers";
import { $CustomEmployeeDataController } from "./Controllers/CustomEmployeeDataController";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { $CustomDirectoryDesignerRowController } from "./Controllers/CustomDirectoryDesignerRowController";
import { $TicketPriceFromApiController } from "./Controllers/TicketPriceFromApiController";
import { ICardSavingEventArgs } from "@docsvision/webclient/System/ICardSavingEventArgs";
import { SavingButtons } from "@docsvision/webclient/Platform/SavingButtons";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { MultipleEmployees } from "@docsvision/webclient/BackOffice/MultipleEmployees";
import { $EmployeeGroupController } from "./Controllers/EmployeeGroupController";
import { $ChangeStateToApprovalController } from "./Controllers/ChangeStateToApprovalController";

let isSavingByNumerator = false;

export async function date_dateTimeChanged(sender: DateTimePicker) {
    let layout = sender.layout;
    let dateFromControl = layout.controls.tryGet<DateTimePicker>("DateFrom");
    let dateToControl = layout.controls.tryGet<DateTimePicker>("DateTo");
    let daysOffControl = layout.controls.tryGet<NumberControl>("DaysOff");
    if (!dateFromControl || !dateToControl || !daysOffControl) { return; }
    let dateFrom, dateTo;
    if (dateFromControl.hasValue() && dateToControl.hasValue()) {
        dateFrom = Date.parse(dateFromControl.params.value.toDateString());
        dateTo = Date.parse(dateToControl.params.value.toDateString());
        if (dateTo - dateFrom < 0) { 
            MessageBox.ShowWarning("Дата \"по\" меньше чем дата \"с\"");
            daysOffControl.params.value = null;
            return; 
        }  
    }
    else {
        daysOffControl.params.value = null;
        return;
    }

    var daysOff = (dateTo - dateFrom) / (1000 * 60 * 60 * 24) + 1;
    daysOffControl.params.value = daysOff;
}

export async function card_activated(sender: Layout) {
    let layout = sender;
    let whoRegisterControl = layout.controls.tryGet<MultipleEmployees>("WhoMakesOut");
    if (!whoRegisterControl) { return; }
    if (whoRegisterControl.hasValue()) { return; }
    let employeeGroupService = layout.getService($EmployeeGroupController);
    let groupModel = await employeeGroupService.GetEmployeeGroup("Секретарь");
    if (groupModel) {
        whoRegisterControl.params.value = groupModel;
        return;
    }
    whoRegisterControl.params.value = null;
}

export async function card_saving(sender: SavingButtons, args: CancelableEventArgs<ICardSavingEventArgs>) {
    args.wait();
    let layout = sender.layout;
    let nameControl = layout.controls.tryGet<TextBox>("Name");
    let numeratorControl = layout.controls.tryGet<Numerator>("ActNumerator");
    if (!nameControl || !numeratorControl) { return; }
    if (isSavingByNumerator) {
        if (!nameControl.hasValue()) {
            MessageBox.ShowWarning("Поле \"Название\" не заполнено!");
            args.cancel();
        }
        else {
            args.accept();
        }
        isSavingByNumerator = false;
    }
    else {
        if (!nameControl.hasValue() || !numeratorControl.hasValue()) {
            MessageBox.ShowWarning("Поле \"Название\" и/или \"Номер заявки\" не заполнено!");
            args.cancel();
        }
        else 
            args.accept();
    }
}

export async function actNumerator_beforeGenerate(sender: Numerator) {
    let layout = sender.layout;
    let numeratorControl = layout.controls.tryGet<Numerator>("ActNumerator");
    if (!numeratorControl) { return; }
    isSavingByNumerator = true;
}

export async function brief_click(sender: CustomButton) {
    let layout = sender.layout;
    let numeratorControl = layout.controls.tryGet<Numerator>("ActNumerator");
    let dateCreationControl = layout.controls.tryGet<DateTimePicker>("CreationDate");
    let dateFromControl = layout.controls.tryGet<DateTimePicker>("DateFrom");
    let dateToControl = layout.controls.tryGet<DateTimePicker>("DateTo");
    let reasonForOffControl = layout.controls.tryGet<TextArea>("ReasonForOff");
    if (!numeratorControl || !dateCreationControl || !dateFromControl || !dateToControl || !reasonForOffControl) { return; }
    let message = "Номер заявки : {0} \nДата создания : {1} \nДаты командировки С : {2} \nпо : {3} \nОснование для поездки : {4}"
        .format(
            (numeratorControl.hasValue() ? numeratorControl.params.value.number : "не задано"),
            (dateCreationControl.hasValue() ? dateCreationControl.params.value.toLocaleDateString() : "не задано"),
            (dateFromControl.hasValue() ? dateFromControl.params.value.toLocaleDateString() : "не задано"),
            (dateToControl.hasValue() ? dateToControl.params.value.toLocaleDateString() : "не задано"),
            (reasonForOffControl.hasValue() ? reasonForOffControl.params.value : "не задано")
        );
    MessageBox.ShowInfo(message);
}

export async function seconded_dataChanged(sender: Employee) {
    let layout = sender.layout;
    let directorControl = layout.controls.tryGet<Employee>("Director");
    let phoneControl = layout.controls.tryGet<TextBox>("Phone");
    if (!directorControl || !phoneControl) { return; }
    if (sender.hasValue()) {
        let customEmployeeService = layout.getService($CustomEmployeeDataController);
        let model = await customEmployeeService.GetEmployeeData(sender.params.value.id);
        if (model) {
            directorControl.params.value = model.director;
            phoneControl.params.value = model.phone;
            return;
        }
    }
    directorControl.params.value = null;
    phoneControl.params.value = null;
}

export async function city_dataChanged(sender: DirectoryDesignerRow) {
    let layout = sender.layout;
    let daysOffControl = layout.controls.tryGet<NumberControl>("DaysOff");
    let amountOffControl = layout.controls.tryGet<NumberControl>("AmountOff");
    if (!daysOffControl || !amountOffControl) { return; }
    if (sender.hasValue() && daysOffControl.hasValue()) {
        let customDirectoryDesignerRowService = layout.getService($CustomDirectoryDesignerRowController);
        let model = await customDirectoryDesignerRowService.GetDirectoryDesignerRowData(sender.params.value.id);
        if (model) {
            amountOffControl.params.value = daysOffControl.params.value * model.dailyAmount;
            return;
        }
    }
    amountOffControl.params.value = null;
}

export async function forApproval_click(sender: CustomButton) {
    let layout = sender.layout;
    let changeStateToApprovalService = layout.getService($ChangeStateToApprovalController);
    let isStateChanged = changeStateToApprovalService.ChangeStateToApproval(layout.cardInfo.id);
    if (isStateChanged)
        layout.reloadFromServer();
}

export async function card_activatedAfterStateChanged(sender: Layout) {
    let layout = sender;
    let forApprovalControl = layout.controls.tryGet<CustomButton>("ForApproval");
    if (layout.cardInfo.state.stateId == "8d315dc1-42bb-4ce8-908f-7daad13fa698") {
        forApprovalControl.params.visibility = true;
    }
    else
        forApprovalControl.params.visibility = false;
}

export async function requestTicketPrice_click(sender: CustomButton) {
    let layout = sender.layout;
    let ticketsPriceControl = layout.controls.tryGet<NumberControl>("TicketsPrice");
    let dateFromControl = layout.controls.tryGet<DateTimePicker>("DateFrom");
    let dateToControl = layout.controls.tryGet<DateTimePicker>("DateTo");
    let cityControl = layout.controls.tryGet<DirectoryDesignerRow>("City");
    if (!ticketsPriceControl || !dateFromControl || !dateToControl || !cityControl) { return; }
    if (dateFromControl.hasValue() && dateToControl.hasValue() && cityControl.hasValue()) {
        let customDirectoryDesignerRowService = layout.getService($CustomDirectoryDesignerRowController);
        let model = await customDirectoryDesignerRowService.GetDirectoryDesignerRowData(cityControl.params.value.id);
        let ticketPriceFromApiService = layout.getService($TicketPriceFromApiController);
        let price = await ticketPriceFromApiService.GetTicketPriceFromAPI(
            model.airportCode,
            dateFromControl.params.value.toDateString(),
            dateToControl.params.value.toDateString()
        );
        if (price != 0) {
            ticketsPriceControl.params.value = price;
            return;
        }
        else
            MessageBox.ShowInfo("Не удалось найти билеты на указанные даты!");
    }
    ticketsPriceControl.params.value = null;
}