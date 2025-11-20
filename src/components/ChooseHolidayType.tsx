const ChooseHolidayType = () => {
    return (
        <div className="level-2 flex-1 p-(--options-elements-padding)">
            <h6 className="text-theme-cta-foreground text-left font-serif leading-none">2. Choose Holiday Type:</h6>

            <div className="flex h-[calc(100%-(var(--options-elements-padding)*2))] flex-col items-end justify-between gap-3 md:flex-row md:gap-4">
                <div className="flex basis-1/2 flex-row items-center justify-start gap-1.5">
                    <input id="select-holiday-type-school" type="checkbox" value="school" checked />
                    <label htmlFor="select-holiday-type-school" className="">
                        School
                    </label>
                    <div className="bg-theme-blocked-range-active-holiday-school h-2 w-full max-w-8 basis-auto rounded-sm" />
                </div>

                <div className="flex basis-1/2 flex-row items-center justify-start gap-1.5">
                    <input id="select-holiday-type-public" type="checkbox" value="public" disabled />
                    <label htmlFor="select-holiday-type-public" className="">
                        Public
                    </label>
                    <div className="bg-theme-blocked-range-active-holiday-public h-2 w-full max-w-8 basis-auto rounded-sm" />
                </div>
            </div>
        </div>
    );
};

export default ChooseHolidayType;
