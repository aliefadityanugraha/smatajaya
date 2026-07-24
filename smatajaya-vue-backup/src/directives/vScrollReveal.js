export const vScrollReveal = {
  mounted(el, binding) {
    const config = binding.value || {}
    const animClass = config.animation || 'fade-in-up'
    const delay = config.delay || 0
    const threshold = config.threshold || 0.15

    el.style.opacity = '0'
    el.classList.add('scroll-hidden', animClass)
    if (delay) el.style.animationDelay = `${delay}s`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('scroll-hidden')
          el.classList.add('scroll-visible')
          el.style.opacity = ''
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
  },
}
