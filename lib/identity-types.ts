import type { BadgeId, BuilderClass, BuilderVibe, GoaEffectId, IdentityType } from "@/lib/builder-data"

export interface CropTransform {
  x: number
  y: number
  zoom: number
  rotation: number
}

export const DEFAULT_CROP: CropTransform = { x: 0, y: 0, zoom: 1, rotation: 0 }

export interface BuilderMember {
  id: string
  photoDataUrl: string | null
  crop: CropTransform
  croppedAreaPixels: { x: number; y: number; width: number; height: number } | null
  name: string
  builderClass: BuilderClass | null
}

export function createEmptyMember(id: string): BuilderMember {
  return {
    id,
    photoDataUrl: null,
    crop: DEFAULT_CROP,
    croppedAreaPixels: null,
    name: "",
    builderClass: null,
  }
}

export type GenerateMode = "pfp" | "builder-id"

export interface IdentityState {
  generateMode: GenerateMode
  idType: IdentityType
  members: BuilderMember[]
  frameId: string
  effects: GoaEffectId[]
  badges: BadgeId[]
  title: string
  vibe: BuilderVibe | null
  stackLine: string
  signature: string
  teamName: string
  passId: string
  serial: string
}

export type IdentityAction =
  | { type: "SET_GENERATE_MODE"; mode: GenerateMode }
  | { type: "SET_ID_TYPE"; idType: IdentityType }
  | { type: "SET_MEMBER_PHOTO"; memberId: string; photoDataUrl: string | null }
  | { type: "SET_MEMBER_CROP"; memberId: string; crop: CropTransform }
  | {
      type: "SET_MEMBER_CROPPED_AREA"
      memberId: string
      area: { x: number; y: number; width: number; height: number }
    }
  | { type: "SET_MEMBER_NAME"; memberId: string; name: string }
  | { type: "SET_MEMBER_CLASS"; memberId: string; builderClass: BuilderClass }
  | { type: "SET_FRAME"; frameId: string }
  | { type: "TOGGLE_EFFECT"; effect: GoaEffectId }
  | { type: "TOGGLE_BADGE"; badge: BadgeId }
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_VIBE"; vibe: BuilderVibe }
  | { type: "SET_STACK_LINE"; stackLine: string }
  | { type: "SET_SIGNATURE"; signature: string }
  | { type: "SET_TEAM_NAME"; teamName: string }
  | { type: "APPLY_PRESET"; frameId: string; effects: GoaEffectId[] }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: IdentityState }
