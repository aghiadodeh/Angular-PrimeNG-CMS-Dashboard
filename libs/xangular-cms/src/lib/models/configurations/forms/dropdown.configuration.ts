import { OptionTemplate } from "./option.template";
import { RemoteDataConfiguration } from "./remote-data.configuration";

export interface DropdownConfiguration {
  showClear?: boolean;
  filter?: boolean;
  filterBy: string;
  optionLabel: string;
  translate?: boolean;
  options: any[];
  optionsFn?: () => any[];
  valueBy: string;
  remoteDataConfiguration?: RemoteDataConfiguration;
  index?: number;
  indexFn?: (items: any[]) => number;
  onChange?: (value: any) => void;
  template?: OptionTemplate;
}
