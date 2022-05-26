import Image from 'next/image'
import React, { useRef, useEffect, useState } from 'react'
import Slider from 'rc-slider'
import { usePlayer } from '../../contexts/PlayerContext'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    toggleLoop,
    isLooping,
    isShuffling,
    toggleShuffle,
    clearPlayerState,
  } = usePlayer()

  function setupProgressListener() {
    audioRef.current.currentTime = 0
    audioRef.current?.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current?.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount

    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if (hasNext || episodeList.length !== 0) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong>Tocando Agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                value={progress}
                max={episode.duration}
                onChange={event => handleSeek(event)}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            onEnded={handleEpisodeEnded}
            loop={isLooping}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type='button'
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          <button
            type='button'
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src='/play-previous.svg' alt='Tocar anterior' />
          </button>
          <button
            type='button'
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src='/pause.svg' alt='Pausar' />
            ) : (
              <img src='/play.svg' alt='Reproduzir' />
            )}
          </button>
          <button
            type='button'
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src='/play-next.svg' alt='Tocar próxima' />
          </button>
          <button
            type='button'
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  )
}
