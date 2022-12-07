define(['tslib', '@docsvision/webclient/Helpers/MessageBox/MessageBox', '@docsvision/webclient/System/ServiceUtils', '@docsvision/webclient/System/UrlStore', '@docsvision/webclient/System/ExtensionManager', '@docsvision/webclient/System/Service'], (function (tslib, MessageBox, ServiceUtils, UrlStore, ExtensionManager, Service) { 'use strict';

    var CustomEmployeeDataController = /** @class */ (function () {
        function CustomEmployeeDataController(services) {
            this.services = services;
        }
        CustomEmployeeDataController.prototype.GetEmployeeData = function (employeeId) {
            var url = UrlStore.urlStore.urlResolver.resolveUrl("GetEmployeeData", "CustomEmployeeData");
            var data = {
                employeeId: employeeId
            };
            return this.services.requestManager.post(url, JSON.stringify(data));
        };
        return CustomEmployeeDataController;
    }());
    var $CustomEmployeeDataController = ServiceUtils.serviceName(function (s) { return s.CustomEmployeeDataController; });

    var CustomDirectoryDesignerRowController = /** @class */ (function () {
        function CustomDirectoryDesignerRowController(services) {
            this.services = services;
        }
        CustomDirectoryDesignerRowController.prototype.GetDirectoryDesignerRowData = function (cityId) {
            var url = UrlStore.urlStore.urlResolver.resolveUrl("GetDirectoryDesignerRowData", "CustomDirectoryDesignerRow");
            var data = {
                cityId: cityId
            };
            return this.services.requestManager.post(url, JSON.stringify(data));
        };
        return CustomDirectoryDesignerRowController;
    }());
    var $CustomDirectoryDesignerRowController = ServiceUtils.serviceName(function (s) { return s.CustomDirectoryDesignerRowController; });

    var TicketPriceFromApiController = /** @class */ (function () {
        function TicketPriceFromApiController(services) {
            this.services = services;
        }
        TicketPriceFromApiController.prototype.GetTicketPriceFromAPI = function (airportCode, dateFrom, dateTo) {
            var url = UrlStore.urlStore.urlResolver.resolveUrl("GetTicketPriceFromAPI", "TicketPriceFromApi");
            var data = {
                airportCode: airportCode,
                dateFrom: dateFrom,
                dateTo: dateTo
            };
            return this.services.requestManager.post(url, JSON.stringify(data));
        };
        return TicketPriceFromApiController;
    }());
    var $TicketPriceFromApiController = ServiceUtils.serviceName(function (s) { return s.TicketPriceFromApiController; });

    var EmployeeGroupController = /** @class */ (function () {
        function EmployeeGroupController(services) {
            this.services = services;
        }
        EmployeeGroupController.prototype.GetEmployeeGroup = function (groupName) {
            var url = UrlStore.urlStore.urlResolver.resolveUrl("GetEmployeeGroup", "EmployeeGroup");
            var data = {
                groupName: groupName
            };
            return this.services.requestManager.post(url, JSON.stringify(data));
        };
        return EmployeeGroupController;
    }());
    var $EmployeeGroupController = ServiceUtils.serviceName(function (s) { return s.EmployeeGroupController; });

    var ChangeStateToApprovalController = /** @class */ (function () {
        function ChangeStateToApprovalController(services) {
            this.services = services;
        }
        ChangeStateToApprovalController.prototype.ChangeStateToApproval = function (cardId) {
            var url = UrlStore.urlStore.urlResolver.resolveUrl("ChangeStateToApproval", "ChangeStateToApproval");
            var data = {
                cardId: cardId
            };
            return this.services.requestManager.post(url, JSON.stringify(data));
        };
        return ChangeStateToApprovalController;
    }());
    var $ChangeStateToApprovalController = ServiceUtils.serviceName(function (s) { return s.ChangeStateToApprovalController; });

    var isSavingByNumerator = false;
    function date_dateTimeChanged(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, dateFromControl, dateToControl, daysOffControl, dateFrom, dateTo, daysOff;
            return tslib.__generator(this, function (_a) {
                layout = sender.layout;
                dateFromControl = layout.controls.tryGet("DateFrom");
                dateToControl = layout.controls.tryGet("DateTo");
                daysOffControl = layout.controls.tryGet("DaysOff");
                if (!dateFromControl || !dateToControl || !daysOffControl) {
                    return [2 /*return*/];
                }
                if (dateFromControl.hasValue() && dateToControl.hasValue()) {
                    dateFrom = Date.parse(dateFromControl.params.value.toDateString());
                    dateTo = Date.parse(dateToControl.params.value.toDateString());
                    if (dateTo - dateFrom < 0) {
                        MessageBox.MessageBox.ShowWarning("Дата \"по\" меньше чем дата \"с\"");
                        daysOffControl.params.value = null;
                        return [2 /*return*/];
                    }
                }
                else {
                    daysOffControl.params.value = null;
                    return [2 /*return*/];
                }
                daysOff = (dateTo - dateFrom) / (1000 * 60 * 60 * 24) + 1;
                daysOffControl.params.value = daysOff;
                return [2 /*return*/];
            });
        });
    }
    function card_activated(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, whoRegisterControl, employeeGroupService, groupModel;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layout = sender;
                        whoRegisterControl = layout.controls.tryGet("WhoMakesOut");
                        if (!whoRegisterControl) {
                            return [2 /*return*/];
                        }
                        if (whoRegisterControl.hasValue()) {
                            return [2 /*return*/];
                        }
                        employeeGroupService = layout.getService($EmployeeGroupController);
                        return [4 /*yield*/, employeeGroupService.GetEmployeeGroup("Секретарь")];
                    case 1:
                        groupModel = _a.sent();
                        if (groupModel) {
                            whoRegisterControl.params.value = groupModel;
                            return [2 /*return*/];
                        }
                        whoRegisterControl.params.value = null;
                        return [2 /*return*/];
                }
            });
        });
    }
    function card_saving(sender, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, nameControl, numeratorControl;
            return tslib.__generator(this, function (_a) {
                args.wait();
                layout = sender.layout;
                nameControl = layout.controls.tryGet("Name");
                numeratorControl = layout.controls.tryGet("ActNumerator");
                if (!nameControl || !numeratorControl) {
                    return [2 /*return*/];
                }
                if (isSavingByNumerator) {
                    if (!nameControl.hasValue()) {
                        MessageBox.MessageBox.ShowWarning("Поле \"Название\" не заполнено!");
                        args.cancel();
                    }
                    else {
                        args.accept();
                    }
                    isSavingByNumerator = false;
                }
                else {
                    if (!nameControl.hasValue() || !numeratorControl.hasValue()) {
                        MessageBox.MessageBox.ShowWarning("Поле \"Название\" и/или \"Номер заявки\" не заполнено!");
                        args.cancel();
                    }
                    else
                        args.accept();
                }
                return [2 /*return*/];
            });
        });
    }
    function actNumerator_beforeGenerate(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, numeratorControl;
            return tslib.__generator(this, function (_a) {
                layout = sender.layout;
                numeratorControl = layout.controls.tryGet("ActNumerator");
                if (!numeratorControl) {
                    return [2 /*return*/];
                }
                isSavingByNumerator = true;
                return [2 /*return*/];
            });
        });
    }
    function brief_click(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, numeratorControl, dateCreationControl, dateFromControl, dateToControl, reasonForOffControl, message;
            return tslib.__generator(this, function (_a) {
                layout = sender.layout;
                numeratorControl = layout.controls.tryGet("ActNumerator");
                dateCreationControl = layout.controls.tryGet("CreationDate");
                dateFromControl = layout.controls.tryGet("DateFrom");
                dateToControl = layout.controls.tryGet("DateTo");
                reasonForOffControl = layout.controls.tryGet("ReasonForOff");
                if (!numeratorControl || !dateCreationControl || !dateFromControl || !dateToControl || !reasonForOffControl) {
                    return [2 /*return*/];
                }
                message = "Номер заявки : {0} \nДата создания : {1} \nДаты командировки С : {2} \nпо : {3} \nОснование для поездки : {4}"
                    .format((numeratorControl.hasValue() ? numeratorControl.params.value.number : "не задано"), (dateCreationControl.hasValue() ? dateCreationControl.params.value.toLocaleDateString() : "не задано"), (dateFromControl.hasValue() ? dateFromControl.params.value.toLocaleDateString() : "не задано"), (dateToControl.hasValue() ? dateToControl.params.value.toLocaleDateString() : "не задано"), (reasonForOffControl.hasValue() ? reasonForOffControl.params.value : "не задано"));
                MessageBox.MessageBox.ShowInfo(message);
                return [2 /*return*/];
            });
        });
    }
    function seconded_dataChanged(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, directorControl, phoneControl, customEmployeeService, model;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layout = sender.layout;
                        directorControl = layout.controls.tryGet("Director");
                        phoneControl = layout.controls.tryGet("Phone");
                        if (!directorControl || !phoneControl) {
                            return [2 /*return*/];
                        }
                        if (!sender.hasValue()) return [3 /*break*/, 2];
                        customEmployeeService = layout.getService($CustomEmployeeDataController);
                        return [4 /*yield*/, customEmployeeService.GetEmployeeData(sender.params.value.id)];
                    case 1:
                        model = _a.sent();
                        if (model) {
                            directorControl.params.value = model.director;
                            phoneControl.params.value = model.phone;
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        directorControl.params.value = null;
                        phoneControl.params.value = null;
                        return [2 /*return*/];
                }
            });
        });
    }
    function city_dataChanged(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, daysOffControl, amountOffControl, customDirectoryDesignerRowService, model;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layout = sender.layout;
                        daysOffControl = layout.controls.tryGet("DaysOff");
                        amountOffControl = layout.controls.tryGet("AmountOff");
                        if (!daysOffControl || !amountOffControl) {
                            return [2 /*return*/];
                        }
                        if (!(sender.hasValue() && daysOffControl.hasValue())) return [3 /*break*/, 2];
                        customDirectoryDesignerRowService = layout.getService($CustomDirectoryDesignerRowController);
                        return [4 /*yield*/, customDirectoryDesignerRowService.GetDirectoryDesignerRowData(sender.params.value.id)];
                    case 1:
                        model = _a.sent();
                        if (model) {
                            amountOffControl.params.value = daysOffControl.params.value * model.dailyAmount;
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        amountOffControl.params.value = null;
                        return [2 /*return*/];
                }
            });
        });
    }
    function forApproval_click(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, changeStateToApprovalService, isStateChanged;
            return tslib.__generator(this, function (_a) {
                layout = sender.layout;
                changeStateToApprovalService = layout.getService($ChangeStateToApprovalController);
                isStateChanged = changeStateToApprovalService.ChangeStateToApproval(layout.cardInfo.id);
                if (isStateChanged)
                    layout.reloadFromServer();
                return [2 /*return*/];
            });
        });
    }
    function card_activatedAfterStateChanged(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, forApprovalControl;
            return tslib.__generator(this, function (_a) {
                layout = sender;
                forApprovalControl = layout.controls.tryGet("ForApproval");
                if (layout.cardInfo.state.stateId == "8d315dc1-42bb-4ce8-908f-7daad13fa698") {
                    forApprovalControl.params.visibility = true;
                }
                else
                    forApprovalControl.params.visibility = false;
                return [2 /*return*/];
            });
        });
    }
    function requestTicketPrice_click(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var layout, ticketsPriceControl, dateFromControl, dateToControl, cityControl, customDirectoryDesignerRowService, model, ticketPriceFromApiService, price;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layout = sender.layout;
                        ticketsPriceControl = layout.controls.tryGet("TicketsPrice");
                        dateFromControl = layout.controls.tryGet("DateFrom");
                        dateToControl = layout.controls.tryGet("DateTo");
                        cityControl = layout.controls.tryGet("City");
                        if (!ticketsPriceControl || !dateFromControl || !dateToControl || !cityControl) {
                            return [2 /*return*/];
                        }
                        if (!(dateFromControl.hasValue() && dateToControl.hasValue() && cityControl.hasValue())) return [3 /*break*/, 3];
                        customDirectoryDesignerRowService = layout.getService($CustomDirectoryDesignerRowController);
                        return [4 /*yield*/, customDirectoryDesignerRowService.GetDirectoryDesignerRowData(cityControl.params.value.id)];
                    case 1:
                        model = _a.sent();
                        ticketPriceFromApiService = layout.getService($TicketPriceFromApiController);
                        return [4 /*yield*/, ticketPriceFromApiService.GetTicketPriceFromAPI(model.airportCode, dateFromControl.params.value.toDateString(), dateToControl.params.value.toDateString())];
                    case 2:
                        price = _a.sent();
                        if (price != 0) {
                            ticketsPriceControl.params.value = price;
                            return [2 /*return*/];
                        }
                        else
                            MessageBox.MessageBox.ShowInfo("Не удалось найти билеты на указанные даты!");
                        _a.label = 3;
                    case 3:
                        ticketsPriceControl.params.value = null;
                        return [2 /*return*/];
                }
            });
        });
    }

    var EventHandlers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        date_dateTimeChanged: date_dateTimeChanged,
        card_activated: card_activated,
        card_saving: card_saving,
        actNumerator_beforeGenerate: actNumerator_beforeGenerate,
        brief_click: brief_click,
        seconded_dataChanged: seconded_dataChanged,
        city_dataChanged: city_dataChanged,
        forApproval_click: forApproval_click,
        card_activatedAfterStateChanged: card_activatedAfterStateChanged,
        requestTicketPrice_click: requestTicketPrice_click
    });

    // Главная входная точка всего расширения
    // Данный файл должен импортировать прямо или косвенно все остальные файлы, 
    // чтобы rollup смог собрать их все в один бандл.
    // Регистрация расширения позволяет корректно установить все
    // обработчики событий, сервисы и прочие сущности web-приложения.
    ExtensionManager.extensionManager.registerExtension({
        name: "DevSchoolFront",
        version: "5.5.16",
        globalEventHandlers: [EventHandlers],
        layoutServices: [
            Service.Service.fromFactory($CustomEmployeeDataController, function (services) { return new CustomEmployeeDataController(services); }),
            Service.Service.fromFactory($CustomDirectoryDesignerRowController, function (services) { return new CustomDirectoryDesignerRowController(services); }),
            Service.Service.fromFactory($TicketPriceFromApiController, function (services) { return new TicketPriceFromApiController(services); }),
            Service.Service.fromFactory($EmployeeGroupController, function (services) { return new EmployeeGroupController(services); }),
            Service.Service.fromFactory($ChangeStateToApprovalController, function (services) { return new ChangeStateToApprovalController(services); })
        ]
    });

}));
//# sourceMappingURL=extension.js.map
