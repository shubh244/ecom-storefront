'use client'

import { useCallback, useEffect, useState } from 'react'
import { FiDownload, FiShare, FiX } from 'react-icons/fi'
import { SITE_NAME } from '@/lib/site'

const DISMISS_KEY = 'sjbw_pwa_install_dismissed'
const DISMISS_DAYS = 7

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const t = Number(raw)
    return Date.now() - t < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export default function InstallAppPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [iosHint, setIosHint] = useState(false)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    if (isStandalone() || isDismissed()) return

    if (isIos()) {
      const t = setTimeout(() => setVisible(true), 2500)
      setIosHint(true)
      return () => clearTimeout(t)
    }

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* ignore */
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return
    setInstalling(true)
    try {
      await deferred.prompt()
      await deferred.userChoice
      setVisible(false)
    } catch {
      /* user cancelled */
    } finally {
      setInstalling(false)
    }
  }, [deferred])

  if (!visible || isStandalone()) return null

  return (
    <div
      className="fixed z-[60] left-0 right-0 px-3 sm:px-4 pointer-events-none"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
      role="dialog"
      aria-label="Install app"
    >
      <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl shadow-xl border border-amber-200/80 bg-white p-4 sm:p-5 flex gap-3 items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {iosHint ? <FiShare className="w-6 h-6" /> : <FiDownload className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm sm:text-base">Install {SITE_NAME}</p>
          {iosHint ? (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
              Tap <strong>Share</strong> in Safari, then <strong>Add to Home Screen</strong> for an app-like experience.
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Add to your home screen for faster access, full screen, and offline-ready browsing.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {!iosHint && deferred ? (
              <button
                type="button"
                onClick={() => void install()}
                disabled={installing}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary active:scale-[0.98] touch-manipulation min-h-[44px]"
              >
                <FiDownload className="w-4 h-4" />
                {installing ? 'Installing…' : 'Install app'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px] touch-manipulation"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Dismiss"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
