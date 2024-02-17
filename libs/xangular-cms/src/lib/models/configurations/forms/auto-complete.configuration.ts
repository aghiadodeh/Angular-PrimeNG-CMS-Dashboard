import { OptionTemplate } from "./option.template";
import { RemoteDataConfiguration } from "./remote-data.configuration";

export interface AutoCompleteConfiguration {
    multiple?: boolean;
    dropdown?: boolean;
    showClear?: boolean;
    filterBy: string;
    optionLabel: string;
    options: any[];
    optionsFn?: () => any[];
    valueBy: string;
    remoteDataConfiguration?: RemoteDataConfiguration;
    index?: number | number[];
    indexFn?: (items: any[]) => number | number[];
    onChange?: (value: any) => void;
    template?: OptionTemplate;

    /**
     * pass options with group like:
     * @example
     ```
    filterBy: 'label',
    optionLabel: '',
    valueBy: 'value',
    group: true,
    options: [
        {
            label: 'Germany', value: 'de',
            items: [
                { label: 'Berlin', value: 'Berlin' },
                { label: 'Frankfurt', value: 'Frankfurt' },
            ]
        },
        {
            label: 'USA', value: 'us',
            items: [
                { label: 'Chicago', value: 'Chicago' },
                { label: 'Los Angeles', value: 'Los Angeles' },
            ]
        },
    ],
     ```
     */
    group?: boolean;
}
