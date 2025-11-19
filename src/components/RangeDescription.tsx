import { useZustandStore } from '../lib/zustandStore';

const RangeDescription = () => {
    const rangeDescription = useZustandStore((store) => store.values.rangeDescription);

    return (
        <div className="level-1 duration-theme flex w-full items-start justify-start p-2">
            <input id="checkbox-range" type="checkbox" className="peer size-0" />
            <label
                htmlFor="checkbox-range"
                className="text-theme-text-dark -mt-1 mr-2 cursor-pointer font-mono text-lg font-bold transition-transform select-none peer-checked:rotate-90"
            >
                &gt;
            </label>

            <div className="duration-theme text-theme-text-dark h-6 w-full overflow-hidden text-sm text-ellipsis transition-[height] peer-checked:h-24">
                {rangeDescription}
            </div>
        </div>
    );
};

export default RangeDescription;
