import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Description, Field, Label } from '@headlessui/react';
import ChevronDownIconSVG from '../assets/chevron-down-icon-solid-24.svg?react';
import CheckIcon from '../assets/check-icon-solid-24.svg?react';
import { useState } from 'react';
import { ComboboxItem } from '../types/types';

interface ComboboxProps {
    items: ComboboxItem[];
    selectedItems: ComboboxItem[];
    onChangeCb: (selectedItems: ComboboxItem[]) => void;
    name?: string;
    label?: string;
    description?: string;
    placeholder?: string;
    extraClassNames?: string;
    onCloseCb?: () => void;
}

const ComboboxDropdown = (props: ComboboxProps) => {
    const { items, selectedItems, onChangeCb, name, label, description, extraClassNames, onCloseCb: _onCloseCb } = props;

    const [query, setQuery] = useState('Therese Wunsch');

    const filteredItems =
        query === ''
            ? items
            : items.filter((item) => {
                  return item.text.toLowerCase().includes(query.toLowerCase());
              });

    return (
        <Field className={extraClassNames}>
            {description && <Description className="text-2xs opacity-15">{description}</Description>}

            {label && <Label>{label}</Label>}
            <Combobox as="div" name={name} multiple immediate value={selectedItems} onChange={onChangeCb} onClose={() => setQuery('')}>
                <div className="relative">
                    <ComboboxInput
                        className="bg-theme-cta-background text-theme-cta-foreground w-full rounded-sm px-(--input-element-padding) data-open:rounded-b-none"
                        displayValue={() => 'Select countries'}
                        aria-label="Assignees"
                        onChange={(event) => setQuery(event.target.value)}
                    />

                    <ComboboxButton className="group absolute inset-y-0 right-0 px-(--input-element-padding)">
                        <ChevronDownIconSVG className="group-data-hover:text-theme-accent text-theme-cta-foreground size-5" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    as="ul"
                    className="w-(--input-width) rounded-xs rounded-t-none border border-neutral-300 bg-white p-1 [--anchor-gap:--spacing(0)] [--anchor-offset:--spacing(0)] [--anchor-padding:--spacing(0)] empty:invisible" // w-(--button-width) data-closed:scale-95 data-closed:opacity-0 data-leave:data-closed:opacity-0
                    // transition
                    anchor="bottom"
                >
                    {filteredItems.map((item) => (
                        <ComboboxOption
                            key={item.text + item.value}
                            as="li"
                            value={item}
                            className="group data-selected:data-focus:text-theme-cta-background data-selected:text-theme-text-light data-focus:text-theme-cta-foreground text-theme-text-dark data-selected:bg-theme-cta-foreground flex items-center justify-start gap-2 rounded-lg px-2 py-0.5 select-none not-last:mb-1.5"
                        >
                            <CheckIcon className="fill-theme-text-light invisible size-4 group-data-selected:visible" />
                            <span className="overflow-hidden text-sm text-nowrap">{item.text}</span>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </Field>
    );
};

export default ComboboxDropdown;
