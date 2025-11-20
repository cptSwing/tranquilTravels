/**
 * Custom with check on left
 * http://tailwindui.com/components/application-ui/forms/select-menus#component-c549ac2695455cb78d529c3a00293fe0
 * This example requires Tailwind CSS v2.0+
 */

import { Fragment, JSX, ReactNode, useState } from 'react';
import { Description, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, ListboxSelectedOption } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

type SelectDropdownItem = {
    value: string;
    text: string;
};

interface SelectDropdownProps {
    name: string;
    initialSelection?: SelectDropdownItem;
    selectionItems: SelectDropdownItem[] | undefined;
    label?: string;
    placeholder: string;
    className?: string;
    onChangeCb: (selectedValues: string[]) => void;
}

const SelectDropdown: (props: SelectDropdownProps) => JSX.Element = (props) => {
    const { name, label, initialSelection, selectionItems, placeholder, onChangeCb, className = '' } = props;
    const [selectedItems, setSelectedItems] = useState<SelectDropdownItem[] | undefined>(initialSelection ? [initialSelection] : undefined);

    return (
        <Field>
            {label && <Label className="block pb-1 text-xs">{label}</Label>}
            <Description>Countries to avoid</Description>

            <SelectDropdownListbox
                name={name}
                value={selectedItems}
                placeholder={placeholder}
                onChange={(changedItems) => {
                    console.log('%c[SelectDropdown]', 'color: #9f20f4', `changedItems :`, changedItems);

                    setSelectedItems(changedItems);
                    onChangeCb(changedItems.map((changedItem) => changedItem.value));
                }}
            >
                {selectionItems?.map((selectionItem) => (
                    <SelectDropdownListboxOption key={selectionItem.text + selectionItem.value} value={selectionItem}>
                        {selectionItem.text}
                    </SelectDropdownListboxOption>
                ))}
            </SelectDropdownListbox>
        </Field>
    );
};

export default SelectDropdown;

type SelectDropdownListboxProps = {
    value: SelectDropdownItem[] | undefined;
    name: string;
    placeholder: string;
    onChange: (value: SelectDropdownItem[]) => void;
    children: ReactNode;
};

const SelectDropdownListbox = ({ value, name, placeholder, onChange, children }: SelectDropdownListboxProps) => {
    return (
        <Listbox value={value} name={name} multiple onChange={onChange}>
            <ListboxButton className="focus:border-theme-cta-foreground focus:ring-theme-cta-foreground bg-theme-cta-background relative w-full cursor-default rounded-sm border border-gray-300 text-left shadow-sm focus:ring-1 focus:outline-none sm:text-sm">
                <ListboxSelectedOption options={children} placeholder={<span className="opacity-50">{placeholder}</span>} />

                {/* {value && <span className="block truncate">{value.map((selectedOption) => selectedOption?.text).join(', ')}</span>} */}

                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                </span>
            </ListboxButton>

            <ListboxOptions anchor="bottom">{children}</ListboxOptions>
        </Listbox>
    );
};

const SelectDropdownListboxOption = ({ value, children }: { value: SelectDropdownItem; children: ReactNode }) => {
    return (
        <ListboxOption as={Fragment} value={value}>
            {({ selected, selectedOption }) => {
                return selectedOption ? (
                    children
                ) : (
                    <div className="data-focus:bg-theme-cta-background relative py-2 pr-4 pl-8 text-neutral-900 select-none data-focus:text-neutral-200">
                        {children}

                        {selected && (
                            <span className="text-hd-palette-main absolute inset-y-0 left-0 flex items-center pl-1.5 data-focus:text-green-500">
                                <CheckIcon className="size-5" aria-hidden="true" />
                            </span>
                        )}
                    </div>
                );
            }}
        </ListboxOption>
    );
};
