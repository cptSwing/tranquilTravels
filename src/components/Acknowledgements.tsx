const Acknowledgements = () => {
    return (
        <div className="text-theme-text-light mx-auto w-full md:w-2/5">
            <h6 className="mb-0.5 text-center italic md:mb-1">Thanks to</h6>

            <ul className="text-2xs grid grid-cols-2 gap-0.5 *:text-center md:gap-1 md:text-xs">
                <li>
                    <a href="https://www.openholidaysapi.org/" target="_blank" rel="noreferrer">
                        OpenHolidays API
                    </a>
                </li>
                <li>headlessui</li>
                <li>heroicons</li>
                <li>
                    <a href="https://gradient.page/ui-gradients" target="_blank" rel="noreferrer">
                        Gradient Page
                    </a>
                </li>
                <li>
                    <a href="https://thenounproject.com/browse/icons/term/deck-chair/" target="_blank" rel="noreferrer">
                        fredley&apos;s deck chair icon (Noun Project)
                    </a>
                </li>
                <li>
                    ChatGPT for the cringe sub-header <br />
                    (the title itself is on me)
                </li>
            </ul>
        </div>
    );
};

export default Acknowledgements;
