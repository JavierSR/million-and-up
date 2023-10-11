import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import type { NextPage, GetServerSideProps } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { wrapper } from '@/redux/store'
import { increasePage, decreasePage, getPage } from '@/redux/page'
import { getInitialCurrencies, getCurrenciesByPage } from '@/services/currency.service'
import Logo from '@/assets/images/logo.png'
import Currency from '@/models/currency.model'
import { calculateHasPositiveTrend } from '@/helpers/currency.helper'
import styles from '@/styles/Home.module.sass'
import UpIcon from '@/assets/icons/up.svg'
import DownIcon from '@/assets/icons/down.svg'

const inter = Inter({ subsets: ['latin'] })

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(() => {
    return async () => {
        const currencies = await getInitialCurrencies()
        return {
            props: {
                currencies,
            }
        }
    }
})

declare interface HomePageProps {
    currencies: Currency[]
}

const Home: NextPage<HomePageProps> = ({ currencies }) => {
    const dispatch = useDispatch()
    const currentPage: number = useSelector(getPage)
    const [totalCurrencies, setTotalCurrencies] = useState<Currency[]>(currencies)
    const [renderedCurrencies, setRenderedCurrencies] = useState<Currency[]>(currencies)
    const isFirstLoad = useRef<boolean>(true)
    const [filterText, setFilterText] = useState<string>('')

    const decreasePageEvent = () => {
        cleanFilterInput()
        dispatch(decreasePage())
    }

    const increasePageEvent = () => {
        cleanFilterInput()
        dispatch(increasePage())
    }

    const cleanFilterInput = () => setFilterText('')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.currentTarget.value)
    }

    const updateCurrencies = async () => {
        const updatedCurrencies = await getCurrenciesByPage(currentPage)
        setTotalCurrencies(updatedCurrencies)
        setRenderedCurrencies(updatedCurrencies)
    }

    useEffect(() => {
        if(isFirstLoad.current) {
            isFirstLoad.current = false;
        }
        else {
            updateCurrencies()
        }
    }, [currentPage])

    useEffect(() => {
        let filteredCurrencies = totalCurrencies

        if(filterText.length) {
            filteredCurrencies = totalCurrencies.filter((currency) => {
                return currency.name.includes(filterText) || currency.nameId.includes(filterText)
            })
        }

        setRenderedCurrencies(filteredCurrencies)
    }, [filterText])

    return (
        <>
            <Head>
                <title>Crypto Currencies</title>
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
            <main className={`main ${inter.className}`}>
                <div className={'container'}>
                    <header className={styles.header}>
                        <Image height={150} width={150} src={Logo} alt='logo'/>
                        <div>
                            <h1>(Really) Enormous Real Estate Company Name Inc.</h1>
                            <h2>Generic AI generated slogan</h2>
                        </div>
                    </header>

                    <section className={styles.body}>
                        <div className={styles.info}>
                            <div>
                                <h3>Currencies available today</h3>
                                <p>Click on currency name to see details</p>
                            </div>
                            <div className={styles.filter}>
                                <input 
                                    type='text'
                                    placeholder='Filter currency'
                                    onChange={handleInputChange}
                                    value={filterText}
                                />
                            </div>
                            <div className={styles.pagination}>
                                <p>Page: </p>
                                <div>
                                    <button onClick={decreasePageEvent}>{'<'}</button>
                                    <span>{currentPage}</span>
                                    <button onClick={increasePageEvent}>{'>'}</button>
                                </div>
                            </div>
                        </div>
                        <table className={styles.currencies}>
                            <thead>
                                <tr>
                                    <th>Currency</th>
                                    <th>Value ($USD)</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderedCurrencies.map((currency) => {
                                    const hasPositiveTrend = calculateHasPositiveTrend(currency.variation24h)
                                    return (
                                        <tr className={`${styles.currency}`} key={currency.id}>
                                            <td>
                                                <Link href={`details/${currency.id}`}>{currency.name}</Link>
                                            </td>
                                            <td>${currency.value}</td>
                                            <td className={`${hasPositiveTrend ? styles.positive : styles.negative}`}>
                                                <div>
                                                    {currency.variation24h}
                                                    {hasPositiveTrend ? 
                                                        <Image height={16} width={16} src={UpIcon} alt='Up icon'/> :
                                                        <Image height={16} width={16} src={DownIcon} alt='Down icon'/>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Home