import { splitDateString } from '../lib/handleDates';
import { useZustandStore } from '../lib/zustandStore';

const store_setDateRange = useZustandStore.getState().methods.store_setDateRange;

const ChooseDateRange = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    return (
        <div className="level-2 flex grow flex-col items-start justify-between gap-y-2 p-(--options-elements-padding)">
            <div className="flex flex-col">
                <h6 className="text-theme-cta-foreground mb-0.5 block text-left font-serif leading-tight">1. Choose Date Range:</h6>
                <p className="text-theme-text-dark text-left text-xs">Pick a timeframe for your vacation (max 11 months)</p>
            </div>

            <div className="flex w-full flex-row items-end justify-between gap-3 md:flex-col md:items-stretch md:gap-4 lg:flex-row lg:items-end">
                <div className="basis-1/2">
                    <label htmlFor="input-date-from" className="text-theme-text-dark mb-px block pl-px text-xs">
                        From
                    </label>
                    <input
                        id="input-date-from"
                        className="bg-theme-cta-background text-theme-text-light w-full rounded-sm px-(--input-element-padding) invalid:bg-red-800"
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
                    <label htmlFor="input-date-to" className="text-theme-text-dark mb-px block pl-px text-xs">
                        To
                    </label>
                    <input
                        id="input-date-to"
                        className="bg-theme-cta-background text-theme-text-light w-full rounded-sm px-(--input-element-padding) invalid:bg-red-800"
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
