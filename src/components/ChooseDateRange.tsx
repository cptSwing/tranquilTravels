import { useZustandStore } from '../lib/zustandStore';

const store_setDateRange = useZustandStore.getState().methods.store_setDateRange;

const ChooseDateRange = () => {
    const { from, to } = useZustandStore((store) => store.values.dateRange);

    return (
        <div className="rounded-xs bg-neutral-500 p-2 shadow-lg">
            <h4>Pick Date Range</h4>
            <span>(max 11 months)</span>
            <div className="h-24 py-8">
                <div className="flex flex-col">
                    <label>
                        From
                        <input
                            className="bg-yellow-200 invalid:bg-red-800"
                            type="date"
                            value={from}
                            max={to} // TODO to minus one day, and max 11 months in total
                            onChange={(ev) => store_setDateRange({ from: ev.target.value })}
                        />
                    </label>
                    <label>
                        To
                        <input
                            className="bg-yellow-200 invalid:bg-red-800"
                            type="date"
                            value={to}
                            min={from} // TODO from plus one day, and max 11 months in total
                            onChange={(ev) => store_setDateRange({ to: ev.target.value })}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ChooseDateRange;

function _isValidDateRange(from: string, to: string) {
    return to > from;
}
