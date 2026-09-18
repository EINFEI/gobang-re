import { z } from 'zod'

export enum Action {
  Initial = 'INITIAL',
  Place = 'PLACE',
  Restart = 'RESTART',
}

export const InitialSchema = z.object({
  action: z.literal(Action.Initial),
  player: z.union([z.literal(0), z.literal(1)]),
})

export const PlaceSchema = z.object({
  action: z.literal(Action.Place),
  x: z.number(),
  y: z.number(),
})

export const RestartSchema = z.object({
  action: z.literal(Action.Restart),
})

export const ActionSchema = z.discriminatedUnion('action', [
  InitialSchema,
  PlaceSchema,
  RestartSchema,
])

export type ActionPayload = z.infer<typeof ActionSchema>
export type InitialPayload = z.infer<typeof InitialSchema>
export type PlacePayload = z.infer<typeof PlaceSchema>
export type RestartPayload = z.infer<typeof RestartSchema>

export type Player = InitialPayload['player']

export function buildPlacePayload(x: number, y: number): PlacePayload {
  return { action: Action.Place, x, y }
}

export function buildInitialPayload(player: Player): InitialPayload {
  return { action: Action.Initial, player }
}

export function buildRestartPayload(): RestartPayload {
  return { action: Action.Restart }
}
