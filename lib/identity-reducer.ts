import { generatePassId, generateSerial } from "@/lib/builder-data"
import { createEmptyMember, type IdentityAction, type IdentityState } from "@/lib/identity-types"

export function createInitialIdentityState(): IdentityState {
  return {
    generateMode: "builder-id",
    idType: "solo",
    members: [createEmptyMember("member-1")],
    frameId: "sunset-ring",
    effects: ["waves", "palms"],
    badges: [],
    title: "",
    vibe: null,
    stackLine: "",
    signature: "",
    teamName: "",
    passId: generatePassId(),
    serial: generateSerial(),
  }
}

function membersForType(idType: IdentityState["idType"], existing: IdentityState["members"]) {
  const targetCount = idType === "solo" ? 1 : idType === "duo" ? 2 : 3
  const next = [...existing]
  while (next.length < targetCount) {
    next.push(createEmptyMember(`member-${next.length + 1}`))
  }
  return next.slice(0, targetCount)
}

export function identityReducer(state: IdentityState, action: IdentityAction): IdentityState {
  switch (action.type) {
    case "SET_GENERATE_MODE":
      return { ...state, generateMode: action.mode }

    case "SET_ID_TYPE":
      return { ...state, idType: action.idType, members: membersForType(action.idType, state.members) }

    case "SET_MEMBER_PHOTO":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.memberId ? { ...m, photoDataUrl: action.photoDataUrl } : m
        ),
      }

    case "SET_MEMBER_CROP":
      return {
        ...state,
        members: state.members.map((m) => (m.id === action.memberId ? { ...m, crop: action.crop } : m)),
      }

    case "SET_MEMBER_CROPPED_AREA":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.memberId ? { ...m, croppedAreaPixels: action.area } : m
        ),
      }

    case "SET_MEMBER_NAME":
      return {
        ...state,
        members: state.members.map((m) => (m.id === action.memberId ? { ...m, name: action.name.toUpperCase() } : m)),
      }

    case "SET_MEMBER_CLASS":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.memberId ? { ...m, builderClass: action.builderClass } : m
        ),
      }

    case "SET_FRAME":
      return { ...state, frameId: action.frameId }

    case "TOGGLE_EFFECT":
      return {
        ...state,
        effects: state.effects.includes(action.effect)
          ? state.effects.filter((e) => e !== action.effect)
          : [...state.effects, action.effect],
      }

    case "TOGGLE_BADGE": {
      const has = state.badges.includes(action.badge)
      if (has) return { ...state, badges: state.badges.filter((b) => b !== action.badge) }
      if (state.badges.length >= 4) return state // cap at 4 badges on the card
      return { ...state, badges: [...state.badges, action.badge] }
    }

    case "SET_TITLE":
      return { ...state, title: action.title.toUpperCase() }

    case "SET_VIBE":
      return { ...state, vibe: action.vibe }

    case "SET_STACK_LINE":
      return { ...state, stackLine: action.stackLine.toUpperCase() }

    case "SET_SIGNATURE":
      return { ...state, signature: action.signature.toUpperCase() }

    case "SET_TEAM_NAME":
      return { ...state, teamName: action.teamName.toUpperCase() }

    case "APPLY_PRESET":
      return { ...state, frameId: action.frameId, effects: action.effects }

    case "RESET":
      return createInitialIdentityState()

    case "HYDRATE":
      return action.state

    default:
      return state
  }
}
