import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import type { NextPage, GetServerSideProps } from 'next'
import { Inter } from 'next/font/google'

import Currency from '@/models/currency.model'
import { getCurrencyDetails } from '@/services/currency.service'
import { calculateHasPositiveTrend } from '@/helpers/currency.helper'
import UpIcon from '@/assets/icons/up.svg'
import DownIcon from '@/assets/icons/down.svg'
import styles from '@/styles/Details.module.sass'

const inter = Inter({ subsets: ['latin'] })

export const getServerSideProps: GetServerSideProps = (async (context) => {
    const currencyId = context.query.currencyId
    const currency = await getCurrencyDetails(currencyId as string)
    return {
        props: { currency }
    }
}) satisfies GetServerSideProps<{ currency: Currency }>

declare interface DetailsPageProps {
    currency: Currency
}

const Details: NextPage<DetailsPageProps> = ({ currency }) => {
    const hasPositiveTrendLastHour = calculateHasPositiveTrend(currency.variation1h)
    const hasPositiveTrendLastDay = calculateHasPositiveTrend(currency.variation24h)
    const hasPositiveTrendLastWeek = calculateHasPositiveTrend(currency.variation7d)

    const [exchangeCrypto, setExchangeCrytpo] = useState<number>(0)
    const [exchangeUSD, setExchangeUSD] = useState<number>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExchangeCrytpo(Number(event.currentTarget.value))
    }

    useEffect(() => {
        if (currency.value) {
            setExchangeUSD(Number((exchangeCrypto * currency.value).toFixed(4)))
        }
    }, [exchangeCrypto])

    return (
        <>
            <Head>
                <title>{currency.name} - Crypto Currencies</title>
                <meta
                    name='description'
                    content='Crypto Currencies Web App by Oscar Sandoval'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main className={`main ${inter.className} ${styles.details}`}>
                <div className={'container'}>
                    <h1>{currency.symbol} - {currency.name}</h1>
                    <div className={styles.info}>
                        <p>USD value: <strong>${currency.value}</strong></p>
                        <p>Rank: <strong>{currency.rank}</strong></p>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.exchange}>
                            <h4>Convert {currency.name} to USD</h4>
                            <div>
                                <input
                                    type='number'
                                    placeholder='0'
                                    value={exchangeCrypto}
                                    onChange={handleInputChange}
                                />
                                {currency.symbol} = ${exchangeUSD} USD
                            </div>
                        </div>
                        <div>
                            <h4>Trends:</h4>
                            <div className={styles.trends}>
                                <div>
                                    <p>Last hour: {currency.variation1h}%</p>
                                    {hasPositiveTrendLastHour ?
                                        <Image height={16} width={16} src={UpIcon} alt='Up icon' /> :
                                        <Image height={16} width={16} src={DownIcon} alt='Down icon' />
                                    }
                                </div>
                                <div>
                                    <p>Last day: {currency.variation24h}%</p>
                                    {hasPositiveTrendLastDay ?
                                        <Image height={16} width={16} src={UpIcon} alt='Up icon' /> :
                                        <Image height={16} width={16} src={DownIcon} alt='Down icon' />
                                    }
                                </div>
                                <div>
                                    <p>Last week: {currency.variation7d}%</p>
                                    {hasPositiveTrendLastWeek ?
                                        <Image height={16} width={16} src={UpIcon} alt='Up icon' /> :
                                        <Image height={16} width={16} src={DownIcon} alt='Down icon' />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.back}>
                        <Link href='/'>Volver</Link>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Details