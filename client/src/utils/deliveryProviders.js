export const DELIVERY_PROVIDERS = {
    nova_post: {
        name: 'Нова пошта',
        src: 'https://api.novaposhta.ua/v2.0/json/',
        parseSrc: () => 'https://api.novaposhta.ua/v2.0/json/',
        apiKey: import.meta.env.VITE_NOVA_POSHTA_API_KEY,
        cityRequest: {
            modelName: 'Address',
            calledMethod: 'searchSettlements',
        },
        branchRequest: {
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            cityRefKey: 'CityRef'
        },
        getCityRequestBody: (query, apiKey) => ({
            apiKey,
            modelName: 'Address',
            calledMethod: 'searchSettlements',
            methodProperties: {
                CityName: query,
                Limit: 10
            }
        }),
        parseCities: (response) =>
            response.data?.[0]?.Addresses.map(city => ({
                Description: city.Present,
                CityName: city.MainDescription,
                Ref: city.DeliveryCity
            })) || [],
        parseBranches: (response) =>
            response.data?.map(branch => ({
                Ref: branch.Ref,
                Description: branch.Description
            })) || []
    },
    meest: {
        name: 'Meest',
        src: 'https://publicapi.meest.com/branches?city=',
        parseSrc: (city) => 'https://publicapi.meest.com/branches?city=' + city,
        getCityRequestBody: null,
        parseCities: () => [],
        parseBranches: (response) =>
            response.result?.map(branch => ({
                Ref: branch.br_id,
                Description: `№${branch.num_showcase}, ${branch.type_public.ua}`
            })) || []
    }
}