import { splitDateString } from '../lib/handleDates';
import { useZustandStore } from '../lib/zustandStore';

const store_setDateRange = useZustandStore.getState().methods.store_setDateRange;

const ChooseDateRange = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    return (
        <div className="bg-theme-background-level-2 rounded-xs p-2 shadow-lg">
            <h4>Pick Date Range</h4>
            <span>(max 11 months)</span>
            <div className="h-24 py-8">
                <div className="flex items-start justify-between">
                    <label>
                        From
                        <input
                            className="bg-yellow-200 invalid:bg-red-800"
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
                    </label>

                    <div className="basis-full" />

                    <label>
                        To
                        <input
                            className="bg-yellow-200 invalid:bg-red-800"
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
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ChooseDateRange;
