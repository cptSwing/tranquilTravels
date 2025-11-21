import config from '../config/config.json';

const Header = () => {
    return (
        <header className="bg-theme-accent text-theme-text-light sticky top-0 z-50 h-(--header-height) w-full shadow-xl">
            <div className="relative mx-auto flex h-full w-(--content-width) items-center justify-end pr-2 md:justify-between">
                <div className=" ">
                    <h2 className="leading-none tracking-tight italic">Tranquil Travels</h2>
                    <span className="text-theme-cta-background -ml-0.5 text-sm leading-none tracking-tight">Find Silence Between the Seasons</span>
                </div>

                <div className="translate-y-full">
                    <span className="text-xs text-emerald-400">v. {config.version}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
