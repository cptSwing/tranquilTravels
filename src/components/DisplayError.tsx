const DisplayError = ({
    error,
}: {
    error: {
        type?: string | null | undefined;
        title?: string | null | undefined;
        status?: number | null | undefined;
        detail?: string | null | undefined;
        instance?: string | null | undefined;
    } & {
        [key: string]: unknown;
    };
}) => (
    <div className="level-1 w-full p-2">
        An error occured {error.status ? `(Status ${error.status})` : ''}
        {error.title ? `: ${error.title}` : '!'}
        <br />
        {JSON.stringify(error.detail)}
        <br />
        {JSON.stringify(error.errors)}
    </div>
);

export default DisplayError;
