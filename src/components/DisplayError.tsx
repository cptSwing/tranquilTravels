import { OpenHolidaysApiError } from '../types/types';

const DisplayError = ({ error }: { error: OpenHolidaysApiError[] | OpenHolidaysApiError }) => {
    const typedError: OpenHolidaysApiError[] = Array.isArray(error) ? error : [error];

    return (
        <>
            {typedError.map((error, idx) => (
                <div key={idx} className="level-1 w-1/4 p-2">
                    An error occured {error.status ? `(Status ${error.status})` : ''}
                    {error.title ? `: ${error.title}` : '!'}
                    <br />
                    {JSON.stringify(error.detail)}
                    <br />
                    {JSON.stringify(error.errors)}
                </div>
            ))}
        </>
    );
};

export default DisplayError;
