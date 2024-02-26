import { CRUDConfiguration, CmsActionEnum, CmsService, FilterInputType, FilterSchema, FormInputType, FormSchema, defaultFilterDto, importMimetype } from "@x-angular/cms";
import { Product } from "../../../../models/product.model";
import { Validators } from "@angular/forms";
import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
import { BehaviorSubject, Observable, finalize } from "rxjs";

@Injectable()
export class ProductService extends CmsService<Product> {
    private calendar$ = new BehaviorSubject<Date>(new Date(2100, 1, 1));
    private categoryDisabled = new BehaviorSubject(true);

    constructor(private datePipe: DatePipe) {
        super();
    }

    public override crudConfiguration: CRUDConfiguration<Product> = {
        openFormType: 'dialog',
        openFilterAccordion: true,
        actions: {
            create: () => true,
            delete: () => true,
            export: () => true,
            selectRows: () => true,
            import: () => {
                return { accept: importMimetype, label: 'import' }
            },
        },
        endPoints: {
            index: 'products',
            view: (id: string) => `products/view/${id}`,
            removeMultiple: (items: Product[]) => {
                return { endPoint: 'products/delete', requestBody: { ids: items.map(item => item.id) } };
            },
            importFile: (file: File) => {
                return { endPoint: 'products/import', requestBody: { media: file }, auto: true };
            },
        },
        tableConfiguration: {
            dataKey: 'id',
            columns: [
                { title: "ID", key: "id", sortKey: 'id' },
                { title: "image", key: "thumbnail", templateRef: true },
                { title: "name", key: "title", sortKey: 'title' },
                { title: "price", key: "price", sortKey: 'price' },
                { title: "brand", key: "brand" },
                { title: "category", key: "category" },
                { title: "rating", key: "rating", sortKey: 'rating', templateRef: true },
                { title: "createdAt", key: "createdAt" },
            ],
            actions: () => [
                {
                    key: CmsActionEnum.view,
                    label: 'view',
                    icon: 'pi pi-eye',
                    severity: 'success',
                },
                {
                    key: CmsActionEnum.update,
                    label: 'update',
                    icon: 'pi pi-pencil',
                },
                {
                    key: 'product-custom_action',
                    label: 'custom_action',
                    icon: 'pi pi-bolt',
                    severity: 'info',
                },
                {
                    key: CmsActionEnum.delete,
                    label: 'delete',
                    icon: 'pi pi-trash',
                    severity: 'danger',
                },
            ],
        },
    }


    public override filterSchema: FilterSchema = {
        inputs: [
            {
                key: 'title',
                label: 'name',
                inputType: FilterInputType.text,
            },
            {
                key: 'brand',
                label: 'brand',
                inputType: FilterInputType.dropdown,
                dropdownConfiguration: {
                    filterBy: 'brand',
                    valueBy: 'brand',
                    optionLabel: 'brand',
                    options: [],
                    onChange: (value: any) => {
                        this.categoryDisabled.next(value == null);
                        this.calendar$.next(new Date());
                    },
                    remoteDataConfiguration: {
                        endPoint: 'products/brands',
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
            {
                key: 'category',
                label: 'category',
                inputType: FilterInputType.dropdown,
                disabled$: this.categoryDisabled,
                dropdownConfiguration: {
                    filterBy: 'category',
                    valueBy: 'category',
                    optionLabel: 'category',
                    options: [],
                    remoteDataConfiguration: {
                        endPoint: 'products/categories',
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
            {
                key: 'price_less',
                label: 'price_less',
                inputType: FilterInputType.number,
            },
            {
                key: 'price_greater',
                label: 'price_greater',
                inputType: FilterInputType.number,
            },
            {
                key: 'createdAt',
                label: 'Created At',
                inputType: FilterInputType.datetime,
                calendarConfiguration: {
                    maxDate$: this.calendar$,
                }
            },
        ],
        filterDto: defaultFilterDto
    };

    public override formSchema: FormSchema<Product> = {
        parseToFormData: true,
        inputs: (item?: Product) => [
            {
                key: 'media',
                label: 'thumbnail',
                value: item?.thumbnail,
                inputType: FormInputType.image,
                validators: item ? [] : [Validators.required],
                imageConfiguration: {
                    path: item?.thumbnail,
                    type: 'rounded',
                }
            },
            {
                key: 'title',
                label: 'name',
                value: item?.title,
                inputType: FormInputType.text,
                validators: [Validators.required],
            },
            {
                key: 'description',
                label: 'description',
                value: item?.description,
                inputType: FormInputType.text,
                validators: [Validators.required],
            },
            {
                key: 'price',
                label: 'price',
                value: item?.price ?? 0,
                inputType: FormInputType.number,
                validators: [Validators.required, Validators.min(1)],
                numberConfiguration: {
                    currency: 'USD',
                    mode: 'currency',
                }
            },
            {
                key: 'discountPercentage',
                label: 'discountPercentage',
                value: item?.discountPercentage ?? 0,
                inputType: FormInputType.number,
                validators: [Validators.min(0)],
                numberConfiguration: {
                    suffix: '%',
                }
            },
            {
                key: 'stock',
                label: 'stock',
                value: 1,
                inputType: FormInputType.number,
                validators: [Validators.required, Validators.min(1)],
            },
            {
                key: 'brand',
                label: 'brand',
                value: item?.brand,
                inputType: FormInputType.dropdown,
                validators: [Validators.required],
                dropdownConfiguration: {
                    filterBy: 'brand',
                    valueBy: 'id',
                    optionLabel: 'brand',
                    options: [],
                    indexFn: (items: any[]) => items.findIndex(e => e.brand == item?.brand),
                    remoteDataConfiguration: {
                        endPoint: 'products/brands',
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
            {
                key: 'category',
                label: 'category',
                value: item?.category,
                inputType: FormInputType.autocomplete,
                validators: [Validators.required],
                autoCompleteConfiguration: {
                    filterBy: 'category',
                    valueBy: 'id',
                    optionLabel: 'category',
                    options: [],
                    dropdown: true,
                    indexFn: (items: any[]) => items.findIndex(e => e.category == item?.category),
                    remoteDataConfiguration: {
                        endPoint: 'products/categories',
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
        ],
    };

    public override mapFetchedData = (data: Product[]) => {
        data.forEach(product => {
            product.rating = Math.round(product.rating ?? 0);
            product.createdAt = this.datePipe.transform(product.createdAt, "yyyy-MM-dd hh:mm a")
        });
        return data;
    };

    override exportFile(): Observable<any> {
        this.exporting$.next(true);
        return this.download(`${this.endPoints.index}/csv`, `${this.endPoints.index}-${new Date()}`, 'csv').pipe(
            finalize(() => this.exporting$.next(false)),
        );
    }
}