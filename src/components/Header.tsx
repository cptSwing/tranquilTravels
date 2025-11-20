const Header = () => {
    return (
        <header className="bg-theme-accent text-theme-text-light sticky top-0 z-50 h-(--header-height) w-full shadow-xl">
            <div className="relative mx-auto flex h-full w-(--content-width) items-center justify-center">
                <h2 className="absolute left-0 select-none">Tranquil Travels</h2>

                <div className="flex items-center justify-start gap-x-4">
                    <a href="#...">
                        <h5>Item 1</h5>
                    </a>
                    <a href="#...">
                        <h5>Item 2</h5>
                    </a>
                    <a href="#...">
                        <h5>Item 3</h5>
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
