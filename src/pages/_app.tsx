import '../styles/globals.scss'
import type { AppProps } from 'next/app'

import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.wrapper}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
