import ChooseCountries from './ChooseCountries';
import ChooseDateRange from './ChooseDateRange';
import ChooseHolidayType from './ChooseHolidayType';

const Options = () => {
    return (
        <div className="level-1 mx-auto flex w-full justify-around gap-3 p-(--main-elements-padding) [--input-element-padding:--spacing(1)] [--options-elements-padding:--spacing(2)]">
            <ChooseDateRange />
            <ChooseHolidayType />
            <ChooseCountries />
        </div>
    );
};

export default Options;
