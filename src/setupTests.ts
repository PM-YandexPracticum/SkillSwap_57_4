import '@testing-library/jest-dom'
import 'react-intersection-observer/test-utils'

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

window.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
