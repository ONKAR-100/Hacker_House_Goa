"use client"

import { useIdentity } from "@/components/identity-builder/identity-context"
import { PhotoCropper } from "@/components/identity-builder/photo-cropper"

export function StepPhoto() {
  const { state, dispatch } = useIdentity()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Upload & Fit Your Photo</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {state.idType === "solo"
            ? "Center your face in the circle — zoom and rotate to get it just right."
            : "Upload a photo for each builder in your squad."}
        </p>
      </div>

      <div className={state.members.length > 1 ? "grid grid-cols-1 gap-6 sm:grid-cols-2" : ""}>
        {state.members.map((member, i) => (
          <div key={member.id} className="flex flex-col gap-2">
            {state.members.length > 1 && (
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Builder {i + 1}
              </span>
            )}
            <PhotoCropper
              photoDataUrl={member.photoDataUrl}
              crop={member.crop}
              label={state.members.length > 1 ? `Builder ${i + 1} photo` : "Your photo"}
              onPhotoChange={(dataUrl) =>
                dispatch({ type: "SET_MEMBER_PHOTO", memberId: member.id, photoDataUrl: dataUrl })
              }
              onCropChange={(crop) => dispatch({ type: "SET_MEMBER_CROP", memberId: member.id, crop })}
              onCroppedAreaChange={(area) =>
                dispatch({ type: "SET_MEMBER_CROPPED_AREA", memberId: member.id, area })
              }
            />
            {state.members.length > 1 && (
              <input
                value={member.name}
                onChange={(e) => dispatch({ type: "SET_MEMBER_NAME", memberId: member.id, name: e.target.value })}
                placeholder={`Builder ${i + 1} name`}
                maxLength={24}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
