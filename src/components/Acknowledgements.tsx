const Acknowledgements = () => {
    return (
        <div className="text-theme-text-light mx-auto max-w-3/4">
            <h6 className="mb-2 text-center italic">Thanks to</h6>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div className="list-disc">OpenHolidays API</div>
                <div className="list-disc">headlessui</div>
                <div className="list-disc">heroicons</div>
                <div className="list-disc">
                    <a href="https://gradient.page/ui-gradients" target="_blank" rel="noreferrer">
                        Gradient Page
                    </a>
                </div>
                <div className="list-disc">
                    <a href="https://thenounproject.com/browse/icons/term/deck-chair/" target="_blank" rel="noreferrer">
                        fredley&apos;s deck chair icon (Noun Project)
                    </a>
                </div>
                <div className="list-disc">ChatGPT for the cringe sub-header (the title itself is on me)</div>
            </div>
        </div>
    );
};

export default Acknowledgements;
