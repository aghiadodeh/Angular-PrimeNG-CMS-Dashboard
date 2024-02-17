import { FileUpload } from "primeng/fileupload";

export interface FileConfiguration {
    accept: string;
    label: string;
    multiple?: boolean;
    maxCount?: number;
    maxFileSize?: number;
    styleClass?: FileUpload['styleClass'];
    
    /**
     * @description when enabled, upload begins automatically after selection is completed.
     * 
     * @default false
     */
    auto?: boolean;
}

export interface ImageConfiguration {
    path?: string;
    type?: 'rounded' | 'circle';
    width?: string;
    height?: string;
}