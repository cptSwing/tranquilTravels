const Header = () => {
    return (
        <header className="bg-theme-accent sticky top-0 right-0 left-0 z-50 flex h-(--header-height) flex-col items-center justify-center text-neutral-50 shadow-lg">
            <div>Tranquil Travels</div>
            <div className="flex items-start justify-start gap-x-2">
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </div>
        </header>
    );
};

export default Header;
