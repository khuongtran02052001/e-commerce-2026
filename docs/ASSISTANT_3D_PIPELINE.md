# 3D Assistant Pipeline

This project supports two assistant models:

- `public/models/assistant-storefront.glb`
- `public/models/assistant-admin.glb`

If either file is missing, the website automatically falls back to the built-in procedural mascot so the UI never breaks.

## Current behavior

- Storefront routes use the `storefront` assistant.
- `/admin` routes use the `admin` assistant.
- The assistant remains fixed at the bottom-right corner.
- Clicking the assistant starts a Driver.js website guide.

## Recommended GLB export settings

- Format: `.glb`
- Up axis: `Y`
- Scale: roughly human bust / chibi fit inside a square card
- Keep triangle count low enough for a floating UI mascot
- Prefer one skinned mesh + a few materials
- Embed textures in the `.glb`

## Suggested model proportions

### Storefront assistant

- Chibi female beauty concierge
- Big head, soft face
- Pink / mauve / ivory palette
- Simple idle pose
- Hair silhouette readable at small size

### Admin assistant

- Modern operator / futuristic concierge
- Cleaner blue / silver palette
- More structured silhouette
- Neutral confident pose

## Where to replace

Drop files here:

```bash
public/models/assistant-storefront.glb
public/models/assistant-admin.glb
```

No code changes are required after replacing the files.

## Notes

- The loader uses a `HEAD` request to check whether the asset exists.
- If you later want per-route animation clips, add named clips inside the GLB and switch them from the assistant component.
