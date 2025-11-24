const ChooseHolidayType = () => {
    return (
        <div className="level-2 flex basis-auto flex-col items-start justify-between gap-y-2 p-(--options-elements-padding)">
            <div>
                <h6 className="text-theme-accent mb-0.5 text-left font-serif leading-tight">2. Choose Holiday Type:</h6>
                <p className="text-left text-xs">View school holidays, public holidays, or both.</p>
            </div>

            <div className="flex w-full flex-row items-end justify-between gap-3 md:gap-4">
                <div className="flex basis-1/2 flex-row items-center justify-start gap-1.5">
                    <input id="select-holiday-type-school" type="checkbox" value="school" checked readOnly />
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
