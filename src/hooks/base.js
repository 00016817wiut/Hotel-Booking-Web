import { useEffect } from "react"

export const useScrollToHash = (location) => {
  useEffect(() => {
    const isReload = performance.getEntriesByType("navigation")[0].type === "reload"

    if (isReload) {
      window.scrollTo(0, 0)
      return
    }
    else {
      if (location.hash) {
        const el = document.querySelector(location.hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
        }
      }

      if (location.pathname === "/rooms") {
        window.scrollTo(0, 0)
      }
    }
  }, [location])
}


export const useLockBodyScroll = (isMenuOpen) => {
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen])
}