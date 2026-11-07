import { describe, expect, it } from "vitest"

import { SPRITES, SPRITE_SIZE, decodeRow } from "./pixel-art"

describe("sprites", () => {
  for (const [name, rows] of Object.entries(SPRITES)) {
    it(`${name} is ${SPRITE_SIZE}x${SPRITE_SIZE}`, () => {
      expect(rows).toHaveLength(SPRITE_SIZE)
      for (const row of rows) expect(decodeRow(row).width).toBe(SPRITE_SIZE)
    })
  }
})
