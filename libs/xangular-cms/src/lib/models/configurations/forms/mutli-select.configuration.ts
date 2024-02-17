import { OptionTemplate } from "./option.template";
import { RemoteDataConfiguration } from "./remote-data.configuration";

export interface MutliSelectConfiguration {
    showClear?: boolean;
    filter?: boolean;
    filterBy: string;
    optionLabel: string;
    options: any[];
    optionsFn?: () => any[];
    valueBy: string;
    remoteDataConfiguration?: RemoteDataConfiguration;
    index?: number[];
    indexFn?: (items: any[]) => number[];
    onChange?: (value: any) => void;
    display?: string | 'comma' | 'chip';
    template?: OptionTemplate;
}
