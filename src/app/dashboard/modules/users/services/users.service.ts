import { CRUDConfiguration, CmsActionEnum, CmsService, FilterInputType, FilterSchema, FormInputType, FormSchema } from "@xangular/cms";
import { User } from "../../../../models/user.model";
import { Validators } from "@angular/forms";
import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class UserService extends CmsService<User> {
    private checkBoxVisiblity$ = new BehaviorSubject(false);
    private bankDisabled$ = new BehaviorSubject(true);

    constructor(private datePipe: DatePipe) {
        super();
    }

    public override crudConfiguration: CRUDConfiguration<User> = {
        openFormType: 'page',
        actions: { create: () => true },
        endPoints: { index: 'user' },
        tableConfiguration: {
            dataKey: 'id',
            columns: [
                { title: "ID", key: "id", sortKey: 'id' },
                { title: "image", key: "image", templateRef: true },
                { title: "name", key: "name", sortKey: 'firstName' },
                { title: "company", key: "company.name" },
                { title: "address", key: "address.address" },
                { title: "createdAt", key: "createdAt" },
            ],
            actions: (item: User) => [
                {
                    key: CmsActionEnum.view,
                    label: 'view',
                    icon: 'pi pi-eye',
                    visible: item.id == 1,
                    severity: 'success',
                },
                {
                    key: CmsActionEnum.update,
                    label: 'update',
                    icon: 'pi pi-pencil',
                    visible: item.id != 1,
                },
                {
                    key: 'custom-user-action',
                    label: 'custom_action',
                    icon: 'pi pi-bolt',
                    severity: 'info',
                    visible: item.id == 1 || item.id == 2,
                },
                {
                    key: CmsActionEnum.delete,
                    label: 'delete',
                    icon: 'pi pi-trash',
                    severity: 'danger',
                    visible: item.id != 1,
                },
            ],
        },
    }


    public override filterSchema: FilterSchema = {
        inputs: [
            {
                key: 'name',
                label: 'name',
                inputType: FilterInputType.text,
            },
        ],
        filterDto: {
            per_page: 15,
            sortKey: 'id',
            sortDir: 'ASC',
        },
    };
    public override formSchema: FormSchema<User> = {
        parseToFormData: true,
        ngClass: 'users-form-container flex flex-wrap gap-3 align-items-center justify-content-center xl:justify-content-start',
        inputs: (item?: User) => [
            {
                key: 'media',
                label: 'image',
                inputType: FormInputType.image,
                validators: item ? [] : [Validators.required],
                imageConfiguration: {
                    path: item?.image,
                    type: 'circle',
                }
            },
            {
                key: 'firstName',
                label: 'firstName',
                value: item?.firstName,
                inputType: FormInputType.text,
                validators: [Validators.required],
                onChange: (event: any) => {
                    console.log('firstName changed', event);
                }
            },
            {
                key: 'maidenName',
                label: 'maidenName',
                value: item?.firstName,
                inputType: FormInputType.text,
                validators: [Validators.required],
            },
            {
                key: 'lastName',
                label: 'lastName',
                value: item?.lastName,
                inputType: FormInputType.text,
                validators: [Validators.required],
            },
            {
                key: 'age',
                label: 'age',
                value: item?.age,
                inputType: FormInputType.number,
                validators: [Validators.required],
            },
            {
                key: 'gender',
                label: 'gender',
                inputType: FormInputType.dropdown,
                validators: [Validators.required],
                onChange: (event: any) => {
                    console.log('gender', event);
                },
                dropdownConfiguration: {
                    filter: false,
                    filterBy: 'title',
                    optionLabel: 'title',
                    valueBy: 'value',
                    indexFn: (items) => {
                        return items.findIndex(e => e.value == item?.gender)
                    },
                    options: ['male', 'female'].map(e => {
                        return { value: e, title: this.primeNgConfig.getTranslation(e) ?? e }
                    }),
                }
            },
            {
                key: 'email',
                label: 'email',
                value: item?.email,
                inputType: FormInputType.email,
                validators: [Validators.required, Validators.email],
            },
            {
                key: 'password',
                label: 'password',
                inputType: FormInputType.password,
                validators: item ? [] : [Validators.required],
                visible: item == undefined,
                onChange: (event: any) => {
                    console.log('password', event);
                },
            },
            {
                key: 'birthDate',
                label: 'birthDate',
                value: item?.birthDate,
                calendarConfiguration: {
                    dateFormat: 'yy-m-d',
                },
                inputType: FormInputType.date,
                validators: [Validators.required],
                onChange: (event: any) => {
                    console.log('birthDate', event);
                },
            },
            {
                key: 'addressId',
                label: 'address',
                inputType: FormInputType.autocomplete,
                validators: [Validators.required],
                onChange: (event: any) => {
                    console.log('address', event);
                },
                autoCompleteConfiguration: {
                    filterBy: 'address',
                    valueBy: 'id',
                    optionLabel: 'address',
                    options: [],
                    dropdown: true,
                    indexFn: (items: any[]) => items.findIndex(e => e.id == item?.id),
                    onChange: (value: any) => {
                        this.bankDisabled$.next(value == null);
                    },
                    remoteDataConfiguration: {
                        endPoint: 'address',
                        queryParams: { pagination: false },
                        mapHttpResponse: (response: any) => response.data,
                    }
                }
            },
            {
                key: 'bankId',
                label: 'bank',
                inputType: FormInputType.dropdown,
                validators: [Validators.required],
                disabled$: this.bankDisabled$,
                dropdownConfiguration: {
                    filterBy: 'iban',
                    valueBy: 'id',
                    optionLabel: 'iban',
                    options: [],
                    indexFn: (items: any[]) => items.findIndex(e => e.id == item?.id),
                    remoteDataConfiguration: {
                        endPoint: 'banks',
                        queryParams: { pagination: false },
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
            {
                key: 'companyId',
                label: 'company',
                inputType: FormInputType.dropdown,
                validators: [Validators.required],
                dropdownConfiguration: {
                    filterBy: 'name',
                    valueBy: 'id',
                    optionLabel: 'name',
                    options: [],
                    indexFn: (items: any[]) => items.findIndex(e => e.id == item?.id),
                    remoteDataConfiguration: {
                        endPoint: 'company',
                        queryParams: { pagination: false },
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
            {
                key: 'radio',
                label: 'gender',
                value: 'male',
                inputType: FormInputType.radio,
                validators: [Validators.required],
                onChange: (event: any) => {
                    console.log('radio', event);
                    this.checkBoxVisiblity$.next(event == 'female')
                },
                radioGroupConfiguration: {
                    ngClass: 'flex gap-6',
                    radioButtons: [
                        { label: 'male', value: 'male' },
                        { label: 'female', value: 'female' },
                    ],
                }
            },
            {
                key: 'checkbox',
                label: 'is Admin',
                value: item != undefined,
                inputType: FormInputType.checkbox,
                validators: [],
                visible$: this.checkBoxVisiblity$,
                onChange: (event: any) => {
                    console.log('checkbox', event);
                },
            },
            {
                key: 'triStateCheckbox',
                label: 'triStateCheckbox',
                value: item != undefined,
                inputType: FormInputType.triStateCheckbox,
                validators: [],
                visible$: this.checkBoxVisiblity$,
                onChange: (event: any) => {
                    console.log('triStateCheckbox', event);
                },
            },
        ],
    };

    public override mapFetchedData = (data: User[]) => {
        data.forEach(user => {
            user.name = `${user.firstName} ${user.lastName}`;
            user.createdAt = this.datePipe.transform(user.createdAt, "yyyy-MM-dd hh:mm a")
        });
        return data;
    };
}