import Currency from '@/models/currency.model'

const adaptSingleCurrency = (currency: any): Currency => {
    return {
        id: currency.id,
        symbol: currency.symbol,
        name: currency.name,
        nameId: currency.nameid,
        rank: currency.rank,
        value: currency.price_usd,
        variation1h: currency.percent_change_1h,
        variation24h: currency.percent_change_24h,
        variation7d: currency.percent_change_7d
    }
}

export const currencyListAdapter = (response: any): Currency[] => {
    try {
        return response.data.map(adaptSingleCurrency)
    }
    catch(error) {
        console.log(error)
        return []
    }
}

export const currencyDetailsAdapter = (response: any): Currency => {
    try {
        if(response && response.length) {
            return adaptSingleCurrency(response[0])
        }
        return {} as Currency
    }
    catch(error) {
        console.log(error)
        return {} as Currency
    }
}