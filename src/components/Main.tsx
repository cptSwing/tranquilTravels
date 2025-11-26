import Calendar from './Calendar';
import Options from './Options';
import Acknowledgements from './Acknowledgements';

const Main = () => {
    return (
        <main className="mx-auto flex w-(--content-width) flex-col items-center justify-start gap-y-4 [--main-elements-padding:--spacing(3)]">
            <Intro />
            <HorizontalRuler widthClass="md:w-2/3 w-full" />

            <Options />
            <Calendar />

            <HorizontalRuler widthClass="w-full md:w-2/3" />
            <Acknowledgements />
            <HorizontalRuler widthClass="w-full md:w-1/3" />
            <Contact />
        </main>
    );
};

export default Main;

const Intro = () => (
    <div className="mt-4 w-full p-(--options-elements-padding) md:mt-6 md:w-2/3">
        <h6 className="text-theme-text-light mb-1 text-center">
            Travel When the Rest of the World <span className="italic">Isn&apos;t</span>
        </h6>
        <p className="text-theme-text-dark text-2xs md:text-xs">
            This site checks public- and school-holiday data across multiple countries, helping you spot those few quiet weeks when airports calm down,
            historical city centers are <span className="italic">actually</span> walkable, and both beach crowds and hotel prices are hopefully at their lowest.{' '}
            <a href="mailto:jens@jbrandenburg.de">Email me</a> with comments, suggestions, or samples of your blind rage.
        </p>
    </div>
);

const Contact = () => (
    <span className="text-2xs mb-8 md:text-xs">
        <a href="https://www.jbrandenburg.de">My site</a> | <a href="https://github.com/cptSwing">My Github</a>
    </span>
);

const HorizontalRuler = ({ widthClass = 'w-2/3' }: { widthClass?: string }) => <div className={'bg-theme-cta-foreground my-1 h-px md:my-2 ' + widthClass} />;
