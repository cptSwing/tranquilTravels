import Calendar from './Calendar';
import RangeDescription from './RangeDescription';
import Options from './Options';
import Debug from './Debug';
import config from '../config/config.json';
import Acknowledgements from './Acknowledgements';

const Main = () => {
    return (
        <main className="mx-auto mt-6 mb-4 flex w-(--content-width) flex-col items-center justify-start gap-y-2 [--main-elements-padding:--spacing(3)]">
            <Options />
            <RangeDescription />
            <Calendar />

            {config.debug && (
                <div className="bg-neutral-500 p-2">
                    <Debug />
                </div>
            )}

            <Acknowledgements />
        </main>
    );
};

export default Main;
