import config from '../config/config.json';
import DeckChairSVG from '../assets/noun-deck-chair-125057.svg?react';
import ChevronDownIconSVG from '../assets/chevron-down-icon-solid-24.svg?react';
import useChangeBackground from '../hooks/useChangeBackground';

const Header = () => {
    const { nextGradient, name } = useChangeBackground();

    return (
        <header className="sticky top-2 z-50 h-(--header-height) w-full border-t-(length:--header-border-width) border-b-(length:--header-border-width) border-[--alpha(var(--html-element-gradient-from)/80%)] bg-(--html-element-gradient-to) shadow outline outline-[--alpha(var(--html-element-gradient-from)/100%)] [--header-border-width:7px] before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:-z-10 before:border-t-(length:--header-border-width) before:border-b-(length:--header-border-width) before:border-neutral-500/40 before:bg-white/60">
            <div className="mx-auto flex h-[calc(var(--header-height)-(2*var(--header-border-width)))] w-(--content-width) items-center justify-between py-1 mix-blend-difference contrast-150">
                <div className="flex h-[calc(var(--header-height)-(4*var(--header-border-width)))] items-center gap-x-2 py-1 select-none">
                    <DeckChairSVG className="aspect-square h-full stroke-[0.75] text-neutral-300" />

                    <div className="flex h-full flex-col items-start justify-center gap-y-1">
                        <h2 className="leading-none tracking-tighter text-(--html-element-gradient-via,var(--color-neutral-400)) italic text-shadow-[color:--alpha(var(--html-element-gradient-via,var(--color-neutral-400))/30%)] text-shadow-sm">
                            Tranquil Travels
                        </h2>
                        <div className="ml-0.5 text-xs leading-none text-neutral-500">Find Silence Between the Seasons</div>
                    </div>
                </div>

                <div className="flex h-[calc(var(--header-height)-(4*var(--header-border-width)))] flex-col items-end justify-around">
                    <button className="group flex cursor-pointer items-center justify-end gap-x-1.5 select-none" onClick={nextGradient}>
                        <span className="pb-px text-sm leading-none text-neutral-500 capitalize italic group-hover:text-neutral-600">{name}</span>
                        <div className="rounded-sm bg-neutral-700 p-px group-hover:bg-neutral-600">
                            <ChevronDownIconSVG className="size-4 -rotate-90 text-neutral-300 group-hover:text-neutral-800" />
                        </div>
                    </button>
                    <span className="inline-block w-full text-right text-xs leading-none text-neutral-700">v. {config.version}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
