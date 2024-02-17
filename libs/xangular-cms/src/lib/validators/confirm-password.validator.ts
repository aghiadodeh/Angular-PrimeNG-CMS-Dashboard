import { FormGroup } from "@angular/forms";

export function confirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        let control = formGroup.controls[controlName];
        let matchingControl = formGroup.controls[matchingControlName]
        if (matchingControl.errors && !matchingControl.errors["passwordNoMatch"]) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ passwordNoMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}