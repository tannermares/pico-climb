import { Engine, Keys } from 'excalibur'

type ObjectWithBooleanValues = { [key: string]: boolean }

export const enableVirtualGamepad = (game: Engine, buttonMap: { [key: string]: Keys }): void => {
  const virtualGamepadState: ObjectWithBooleanValues = {}
  window.addEventListener('message', event => {
    if (event.origin !== window.location.origin) {
      return // Ignore messages from unknown origins
    }

    const { action, state }: { action: string; state: ObjectWithBooleanValues } = event.data
    if (action === 'virtualGamepadState') {
      for (const [name, buttonState] of Object.entries(state)) {
        if (virtualGamepadState[name] != buttonState) {
          virtualGamepadState[name] = buttonState

          const key = buttonMap[name]
          if (key) {
            game.input.keyboard.triggerEvent(buttonState ? 'down' : 'up', key)
          }
        }
      }
    }
  })
}
