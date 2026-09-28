import type { ComponentProps } from "react";
import Input from "./Input";
import InputError from "./InputError";
import Label from "./Label";

type FormFieldProps = ComponentProps<"input"> & {
    label: string;
    name: string;
    error?: string[];
};

export default function FormField({ label, name, error, ...props }: FormFieldProps) {
    return (
        <div>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} {...props} />
            <InputError messages={error} />
        </div>
    );
}