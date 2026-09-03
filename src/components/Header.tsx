import config from '../config/config.json';
import DeckChairSVG from '../assets/noun-deck-chair-125057.svg?react';
import ArrowPathRoundedSquareSVG from '../assets/arrow-path-rounded-square-solid-24.svg?react';
import useChangeBackground from '../hooks/useChangeBackground';

const Header = () => {
    const { nextGradient, name } = useChangeBackground();

    return (
        <header className="absolute top-2 z-50 h-(--header-height) w-full border-t-(length:--header-border-width) border-b-(length:--header-border-width) border-[--alpha(var(--html-element-gradient-from)/80%)] bg-(--html-element-gradient-to) shadow outline outline-[--alpha(var(--html-element-gradient-from)/100%)] [--header-border-width:7px] before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:-z-10 before:border-t-(length:--header-border-width) before:border-b-(length:--header-border-width) before:border-neutral-500/40 before:bg-white/60">
            <div className="mx-auto flex h-[calc(var(--header-height)-(2*var(--header-border-width)))] w-(--content-width) items-center justify-between mix-blend-difference">
                {/* Logo and Title */}
                <div className="flex h-[calc(var(--header-height)-(4*var(--header-border-width)))] items-center gap-x-2 select-none md:gap-x-3 xl:gap-x-4">
                    <div className="-ml-1 flex aspect-square h-[calc(var(--header-height)-(5*var(--header-border-width)))] items-center justify-center self-center rounded-full border-1 border-neutral-500/30 bg-neutral-900 p-1.5">
                        <DeckChairSVG className="aspect-square h-full translate-x-0.5 scale-150 stroke-[0.5] text-neutral-400" />
                    </div>

                    <div className="flex h-full flex-col items-stretch justify-around gap-y-1">
                        <h2 className="-mt-1 leading-none tracking-tighter text-(--html-element-gradient-via,var(--color-neutral-400)) italic text-shadow-[--alpha(var(--html-element-gradient-via,var(--color-neutral-400))/30%)] text-shadow-sm">
                            Tranquil Travels
                        </h2>
                        <div className="ml-0.5 text-xs leading-none text-neutral-500">Find Silence Between the Seasons</div>
                    </div>
                </div>

                {/* Button and version */}
                <div className="flex h-[calc(var(--header-height)-(4*var(--header-border-width)))] flex-col items-end justify-around gap-y-0 md:gap-y-1">
                    <span className="text-2xs inline-block text-right leading-none text-neutral-700">v. {config.version}</span>

                    <div className="flex flex-col items-end justify-between md:flex-row md:items-center">
                        <span className="text-2xs mr-px mb-0.5 text-right leading-none text-neutral-600 italic md:mr-1.5 md:mb-auto md:text-xs">{name}</span>

                        <button
                            className="flex cursor-pointer items-center justify-between gap-x-0.5 rounded-xl border-1 border-neutral-700 bg-neutral-800 px-1 text-neutral-500 select-none hover:border-neutral-800 hover:bg-neutral-900 hover:text-black active:border-neutral-800 active:bg-neutral-900 active:text-black md:gap-x-1.5 md:border-3 md:px-2"
                            onClick={nextGradient}
                        >
                            <span className="mb-0.5 text-xs leading-none font-bold capitalize md:-mb-px">Theme</span>
                            <ArrowPathRoundedSquareSVG className="size-4 md:size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
