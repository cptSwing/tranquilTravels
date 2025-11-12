import { $api } from '../lib/api';

const OpenApiQueryTest = () => {
    const { data, error, isLoading } = $api.useQuery('get', '/Countries', {
        // parameters: {
        //     query: { languageIsoCode: 'DE' },
        // },
    });

    if (isLoading || !data) return 'Loading...';
    if (error) return `An error occured: ${error.message}`;

    console.log('%c[OpenApiQueryTest]', 'color: #721c9d', `data :`, data);

    return (
        <ul>
            {data.map((elem) => (
                <li>{elem.isoCode}</li>
            ))}
        </ul>
    );
};

export default OpenApiQueryTest;
