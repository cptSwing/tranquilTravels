const Header = () => {
    return (
        <header className="sticky top-0 right-0 left-0 z-50 flex h-(--header-height) flex-col items-center justify-between bg-orange-700 pt-8 pb-2 text-neutral-300">
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
