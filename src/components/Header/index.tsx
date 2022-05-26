import { format } from 'date-fns'
import React, { useContext } from 'react'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import Image from 'next/image'

import styles from './styles.module.scss'

export const Header: React.FC = () => {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  return (
    <div className={styles.headerContainer}>
      <Link href='/'>
        <button type='button'>
          <Image src='/logo.svg' alt='Podcastr' width={163} height={60} />
        </button>
      </Link>
      <p>O melhor para voce ouvir, sempre</p>
      <span>{currentDate}</span>
    </div>
  )
}
