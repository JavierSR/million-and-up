import Currency from '@/models/currency.model'
import { API_URL } from '../constants/constants'
import { httpGetRequest } from '@/helpers/httpRequest.helper'
import { currencyListAdapter, currencyDetailsAdapter } from '@/adapters/currency.adapter'

export const getInitialCurrencies = async (): Promise<Currency[]> => {
    return currencyListAdapter(await httpGetRequest({
        url: `${API_URL.COINLORE.URL}/api/tickers`
    }))
}

export const getCurrenciesByPage = async (page: number): Promise<Currency[]> => {
    return currencyListAdapter(await httpGetRequest({
        url: `${API_URL.COINLORE.URL}/api/tickers/?start=${(page - 1) * 100}&limit=100`
    }))
}

export const getCurrencyDetails = async (id: string): Promise<Currency> => {
    return currencyDetailsAdapter(await httpGetRequest({
        url: `${API_URL.COINLORE.URL}/api/ticker/?id=${id}`
    }))
}