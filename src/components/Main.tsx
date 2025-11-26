import Calendar from './Calendar';
import Options from './Options';
import Acknowledgements from './Acknowledgements';

const Main = () => {
    return (
        <main className="mx-auto mt-6 mb-4 flex w-(--content-width) flex-col items-center justify-start gap-y-4 [--main-elements-padding:--spacing(3)]">
            <Options />
            <Calendar />

            <Acknowledgements />
        </main>
    );
};

export default Main;
