import { useZustandStore } from '../lib/zustandStore';

const store_setHolidayType = useZustandStore.getState().methods.store_setHolidayType;

const ChooseHolidayType = () => {
    const holidayType = useZustandStore((s) => s.values.holidayType),
        { schoolHoliday, publicHoliday } = holidayType;

    return (
        <div className="level-2 flex grow flex-col items-start justify-between gap-y-3 p-(--options-elements-padding)">
            <div className="">
                <h6 className="text-theme-cta-foreground mb-0.5 text-left font-serif leading-tight">2. Holidays To Track:</h6>
                <p className="text-theme-text-dark text-left text-xs">View school holidays, public holidays, or both.</p>
            </div>

            <div className="flex w-full flex-row items-end justify-between gap-3 md:flex-col md:items-stretch md:gap-4 xl:flex-row xl:items-end">
                <div className="flex grow flex-row items-center justify-start gap-1.5">
                    <input
                        id="select-holiday-type-school"
                        type="checkbox"
                        className="checked:bg-theme-cta-background"
                        checked={schoolHoliday}
                        onChange={(ev) => store_setHolidayType({ ...holidayType, schoolHoliday: ev.target.checked })}
                    />
                    <label htmlFor="select-holiday-type-school" className="text-theme-text-dark">
                        School
                    </label>
                    <div className="bg-theme-blocked-range-active-holiday-school h-2 w-full max-w-1/3 grow basis-auto rounded-sm" />
                </div>

                <div className="flex grow flex-row items-center justify-start gap-1.5">
                    <input
                        id="select-holiday-type-public"
                        type="checkbox"
                        className="checked:bg-theme-cta-background"
                        checked={publicHoliday}
                        onChange={(ev) => store_setHolidayType({ ...holidayType, publicHoliday: ev.target.checked })}
                    />
                    <label htmlFor="select-holiday-type-public" className="text-theme-text-dark">
                        Public
                    </label>
                    <div className="bg-theme-blocked-range-active-holiday-public h-2 w-full max-w-1/3 grow basis-auto rounded-sm" />
                </div>
            </div>
        </div>
    );
};

export default ChooseHolidayType;
