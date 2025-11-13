import { useZustandStore } from '../lib/zustandStore';

const store_setTravelDates = useZustandStore.getState().methods.store_setTravelDates;

const ChooseTravelDates = () => {
    const { from, to } = useZustandStore((store) => store.values.travelDates);

    return (
        <div className="flex flex-col">
            <label>
                From
                <input
                    className="bg-yellow-200 invalid:bg-red-800"
                    type="date"
                    value={from}
                    max={to} // TODO to minus one day
                    onChange={(ev) => store_setTravelDates({ from: ev.target.value })}
                />
            </label>
            <label>
                To
                <input
                    className="bg-yellow-200 invalid:bg-red-800"
                    type="date"
                    value={to}
                    min={from} // TODO from plus one day
                    onChange={(ev) => store_setTravelDates({ to: ev.target.value })}
                />
            </label>
        </div>
    );
};

export default ChooseTravelDates;

function isValidDateRange(from: string, to: string) {
    return to > from;
}
