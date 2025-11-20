import { splitDateString } from '../lib/handleDates';
import { useZustandStore } from '../lib/zustandStore';

const store_setDateRange = useZustandStore.getState().methods.store_setDateRange;

const ChooseDateRange = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    return (
        <div className="level-2 basis-2/5 p-(--options-elements-padding)">
            <div className="flex flex-col sm:flex-row">
                <h6 className="text-theme-cta-foreground block text-left font-serif leading-none">1. Choose Date Range:</h6>
                <span className="text-left text-xs sm:ml-4">(max 11 months)</span>
            </div>

            <div className="flex h-[calc(100%-(var(--options-elements-padding)*2))] flex-col items-end justify-between gap-3 md:flex-row md:gap-4">
                <div className="basis-1/2">
                    <label htmlFor="input-date-from" className="mb-px block pl-px text-xs">
                        From
                    </label>
                    <input
                        id="input-date-from"
                        className="bg-theme-cta-background text-theme-cta-foreground w-full rounded-sm px-1 invalid:bg-red-800"
                        type="date"
                        value={from.dateString}
                        max={to.dateString} // TODO to minus one day, and max 11 months in total
                        onChange={(ev) => {
                            const fromNumbers = splitDateString(ev.target.value);
                            if (fromNumbers) {
                                const from = { ...fromNumbers, dateString: ev.target.value };
                                store_setDateRange({ from });
                            }
                        }}
                    />
                </div>

                <div className="basis-1/2">
                    <label htmlFor="input-date-to" className="mb-px block pl-px text-xs">
                        To
                    </label>
                    <input
                        id="input-date-to"
                        className="bg-theme-cta-background text-theme-cta-foreground w-full rounded-sm px-1 invalid:bg-red-800"
                        type="date"
                        value={to.dateString}
                        min={from.dateString} // TODO from plus one day, and max 11 months in total
                        onChange={(ev) => {
                            const toNumbers = splitDateString(ev.target.value);
                            if (toNumbers) {
                                const to = { ...toNumbers, dateString: ev.target.value };
                                store_setDateRange({ to });
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChooseDateRange;
