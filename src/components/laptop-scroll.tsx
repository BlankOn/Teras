import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import type * as THREE_NS from 'three'

/*
 * Scroll-driven laptop hero.
 *
 * The laptop model, the keyboard overlay and the opening mechanism come from
 * "Minimal Three.js Laptop Template" by Ksenia Kondrashova (MIT):
 * https://codepen.io/ksenia-k/pen/gOEgyaj
 * See public/laptop/LICENSE-laptop-model.txt. The Apple logo, the notch and the
 * Apple-only key glyphs have been removed from the model and the overlay.
 */

const MODEL_URL = '/laptop/mac-noUv.glb'
const KEYBOARD_URL = '/laptop/keyboard-overlay.png'
const SCREEN_IMAGE = '/screenshot.png'
// Boni, the BlankOn mascot, who closes the page.
const BONI_IMAGE = '/boni-pose-3.png'

const SCREEN_SIZE = [29.4, 20] // model units

// The lid folds flat onto the base at PI/2 and stops square to it at 0.
const LID_CLOSED = 0.5 * Math.PI
const LID_OPEN = 0
const LID_Z_CLOSED = 0.5

// Turned to the right when shut, swinging left as it opens.
const YAW_START = (45 * Math.PI) / 180
const YAW_END = (-25 * Math.PI) / 180

// Shares of the run-up to stage five, which is where the laptop arrives
// square to the camera and half pushed in: the lid finishes opening, then it
// swings back to centre, and the camera starts closing in behind it.
const OPEN_END = 0.7
const RECENTRE_START = 0.7
const ZOOM_START = 0.78

// How lit the panel is the instant it wakes, before the backlight ramps up.
const DIM = 0.06

// How far the push in has got by the time stage five arrives, and how close
// the camera ends up - a share of its resting distance.
const STAGE5_ZOOM = 0.75
const ZOOM_FACTOR = 0.3

// Breathing room left around the screen when it is framed at stage five, so
// the panel never runs off the sides of the viewport.
const SCREEN_MARGIN = 1.12

export interface LaptopScrollCopy {
  heroTitle: string
  heroTagline: string
  scrollHint: string
  panel2Title: string
  panel2Body: string
  panel3Title: string
  panel3Body: string
  panel4Title: string
  panel4Body: string
  prayaUrl: string
  prayaLearnMoreUrl: string
  learnMore: string
  learnMoreUrl: string
  comingSoon: string
  ctaDownload: string
  ctaEngage: string
  ctaContribute: string
  ctaDonate: string
  ctaUrl: string
  contributeUrl: string
  donateUrl: string
  credit: Array<string>
  creditLink: string
}

export default function LaptopScroll({
  lang,
  copy,
}: {
  lang: string
  copy: LaptopScrollCopy
}) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const finaleRef = useRef<HTMLDivElement>(null)
  const prayaRef = useRef<HTMLElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = sceneRef.current
    const intro = introRef.current
    const hint = hintRef.current
    const finale = finaleRef.current
    const prayaSection = prayaRef.current
    const root = rootRef.current
    if (!container || !intro || !hint || !finale || !prayaSection || !root)
      return

    // The site header sits above the hero and is part of the flow, so a full
    // 100svh first panel hangs its content below the fold. Take the header
    // height back off it.
    const fitIntro = () => {
      intro.style.minHeight = `calc(100svh - ${root.offsetTop}px)`
    }
    fitIntro()
    window.addEventListener('resize', fitIntro)

    let disposed = false
    const isDisposed = () => disposed
    const cleanups: Array<() => void> = []

    // three touches WebGL, so it stays out of the SSR bundle.
    void (async () => {
      const THREE = await import('three')
      const { GLTFLoader } =
        await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { RectAreaLightUniformsLib } =
        await import('three/examples/jsm/lights/RectAreaLightUniformsLib.js')
      const { RoomEnvironment } =
        await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (isDisposed()) return

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      /* ---------- renderer / scene / camera ---------- */

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      // VSM blurs the shadow map itself, giving a soft-edged contact shadow
      // rather than a hard silhouette.
      renderer.shadowMap.type = THREE.VSMShadowMap
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0
      container.appendChild(renderer.domElement)
      RectAreaLightUniformsLib.init()

      const scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0x0e1013, 14, 36)

      // Image-based lighting: a soft room lights the model from every
      // direction, so the metal picks up broad gradients rather than a single
      // hard highlight.
      const pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environmentIntensity = 0.35
      pmrem.dispose()

      // Front view: nearly level with the laptop, only slightly above.
      // A tight near/far range is what gives the depth buffer the precision to
      // keep the screen from z-fighting with the panel behind it on mobile
      // GPUs. Near stays at 2 rather than higher so the floor directly under
      // the camera isn't clipped.
      const camera = new THREE.PerspectiveCamera(35, 1, 2, 60)
      const lookAt = new THREE.Vector3(0, 0.95, 0)

      /* ---------- lights ---------- */

      scene.add(new THREE.HemisphereLight(0x9fb4d4, 0x14161a, 0.3))

      // The key light only shapes the scene; the environment does the lifting.
      const key = new THREE.DirectionalLight(0xffffff, 1.15)
      key.position.set(5, 9, 7)
      key.castShadow = true
      key.shadow.mapSize.set(2048, 2048)
      key.shadow.camera.near = 1
      key.shadow.camera.far = 30
      key.shadow.camera.left = -5
      key.shadow.camera.right = 5
      key.shadow.camera.top = 5
      key.shadow.camera.bottom = -5
      key.shadow.radius = 3
      key.shadow.blurSamples = 16
      key.shadow.bias = -0.0008
      key.shadow.normalBias = 0.03
      scene.add(key)

      const rim = new THREE.DirectionalLight(0x6ea8ff, 0.35)
      rim.position.set(-6, 3, -5)
      scene.add(rim)

      const fill = new THREE.DirectionalLight(0xffffff, 0.18)
      fill.position.set(-3, 2, 8)
      scene.add(fill)

      /* ---------- floor ---------- */

      // The floor is lit mostly by the environment, which casts no shadow, so
      // hold that back here to keep the contact shadow readable.
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.MeshStandardMaterial({
          color: 0x15181d,
          roughness: 0.95,
          metalness: 0.0,
          envMapIntensity: 0.15,
        }),
      )
      floor.rotation.x = -Math.PI / 2
      floor.receiveShadow = true
      scene.add(floor)

      /* ---------- laptop ---------- */

      // macGroup is the root that yaws on the floor. The model's own origin is
      // not its centre, so `centring` carries that offset - otherwise the yaw
      // axis sits off to one side and the laptop swings out of frame.
      const macGroup = new THREE.Group()
      scene.add(macGroup)
      const centring = new THREE.Group()
      macGroup.add(centring)
      const lidGroup = new THREE.Group()
      centring.add(lidGroup)
      const bottomGroup = new THREE.Group()
      centring.add(bottomGroup)

      let needsRender = true

      // The screenshot doesn't share the panel's aspect ratio, so it is drawn
      // centred on a correctly-proportioned canvas rather than stretched.
      const makeScreenTexture = (src: string) => {
        const c = document.createElement('canvas')
        c.width = 1470
        c.height = Math.round((1470 * SCREEN_SIZE[1]) / SCREEN_SIZE[0])
        const g = c.getContext('2d')!
        g.fillStyle = '#000'
        g.fillRect(0, 0, c.width, c.height)

        const tex = new THREE.CanvasTexture(c)
        tex.flipY = false
        tex.colorSpace = THREE.SRGBColorSpace

        const img = new Image()
        img.onload = () => {
          // Fitted, not stretched: the panel is 3:2-ish and the screenshot
          // 16:9, so it is drawn as large as it goes with its proportions
          // intact and the panel's own black either side of it.
          const s = Math.min(c.width / img.width, c.height / img.height)
          const w = img.width * s
          const h = img.height * s
          g.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h)
          tex.needsUpdate = true
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
          needsRender = true
        }
        img.src = src

        return tex
      }

      const textLoader = new THREE.TextureLoader()
      const screenImageTexture = makeScreenTexture(SCREEN_IMAGE)

      const screenMaterial = new THREE.MeshBasicMaterial({
        map: screenImageTexture,
        transparent: true,
        opacity: 0,
        side: THREE.BackSide,
      })

      const keyboardTexture = textLoader.load(KEYBOARD_URL, () => {
        needsRender = true
      })
      const keyboardMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        alphaMap: keyboardTexture,
        transparent: true,
      })

      const darkPlasticMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.9,
        metalness: 0.9,
      })
      const baseMetalMaterial = new THREE.MeshStandardMaterial({
        color: 0xcecfd3,
      })

      // Branded parts of the donor model: the logo on the lid, and the camera
      // bump that reads as a notch at the top of the display.
      const drop = ['logo', 'camera']

      const parseModel = (glb: { scene: THREE_NS.Object3D }) => {
        ;[...glb.scene.children].forEach((child) => {
          if (child.name === '_top') {
            lidGroup.add(child)
            ;[...child.children].forEach((mesh) => {
              if (drop.includes(mesh.name)) {
                mesh.removeFromParent()
                return
              }
              const m = mesh as THREE_NS.Mesh
              if (mesh.name === 'lid') m.material = baseMetalMaterial
              else if (mesh.name === 'screen-frame')
                m.material = darkPlasticMaterial
              m.castShadow = true
              m.receiveShadow = true
            })
          } else if (child.name === '_bottom') {
            bottomGroup.add(child)
            ;[...child.children].forEach((mesh) => {
              const m = mesh as THREE_NS.Mesh
              if (mesh.name === 'base') m.material = baseMetalMaterial
              else if (
                mesh.name === 'legs' ||
                mesh.name === 'keyboard' ||
                mesh.name === 'inner'
              )
                m.material = darkPlasticMaterial
              m.castShadow = true
              m.receiveShadow = true
            })
          }
        })
      }

      // The model ships without UVs, so the lit screen and the keys are added
      // as textured planes on top of it.
      let screenLight: THREE_NS.RectAreaLight
      // The lit panel, and its world position - what the closing zoom flies
      // into.
      let screenMesh: THREE_NS.Mesh
      const screenCentre = new THREE.Vector3(0, 1.5, 0)

      const addScreen = () => {
        screenMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(SCREEN_SIZE[0], SCREEN_SIZE[1]),
          screenMaterial,
        )
        screenMesh.position.set(0, 10.5, -0.11)
        screenMesh.rotation.set(Math.PI, 0, 0)
        lidGroup.add(screenMesh)

        screenLight = new THREE.RectAreaLight(
          0xffffff,
          0,
          SCREEN_SIZE[0],
          SCREEN_SIZE[1],
        )
        screenLight.position.set(0, 10.5, 0)
        screenLight.rotation.set(Math.PI, 0, 0)
        lidGroup.add(screenLight)

        // A black panel behind it, so the closed lid isn't see-through. It
        // sits well back rather than hairline-close, so the two never fight
        // for the same depth.
        const darkScreen = new THREE.Mesh(
          screenMesh.geometry,
          darkPlasticMaterial,
        )
        darkScreen.position.set(0, 10.5, -0.18)
        darkScreen.rotation.set(Math.PI, Math.PI, 0)
        lidGroup.add(darkScreen)
      }

      const addKeyboard = () => {
        const keyboardKeys = new THREE.Mesh(
          new THREE.PlaneGeometry(27.7, 11.6),
          keyboardMaterial,
        )
        keyboardKeys.rotation.set(-0.5 * Math.PI, 0, 0)
        keyboardKeys.position.set(0, 0.045, 7.21)
        bottomGroup.add(keyboardKeys)
      }

      // The model is ~30 units wide; scale it to this scene, then sit it on
      // the floor.
      const fitToScene = () => {
        lidGroup.rotation.x = LID_CLOSED
        lidGroup.position.z = LID_Z_CLOSED
        macGroup.scale.setScalar(1)
        centring.position.set(0, 0, 0)
        macGroup.updateMatrixWorld(true)

        // Measured unscaled, so the offset applies in the model's own units.
        const box = new THREE.Box3().setFromObject(macGroup)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())

        macGroup.scale.setScalar(4.4 / size.x)
        // Centre it on the yaw axis in x/z, and stand it on the floor in y.
        centring.position.set(-center.x, -box.min.y, -center.z)
      }

      /* ---------- scroll driving ---------- */

      const easeInOut = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      let target = 0
      let current = 0
      let ready = false

      // Measured against the hero's own box, since the site header sits above
      // it and the page may carry more below. The one keyframe - the laptop
      // arriving centred and three quarters pushed in for stage five - is
      // read off the layout rather than hard-coded, so the panel heights stay
      // free to change.
      let animStart = 0
      let animSpan = 1
      let prayaStart = 0.7

      const measure = () => {
        const docTop = (el: HTMLElement) =>
          el.getBoundingClientRect().top + window.scrollY

        animStart = docTop(root)
        animSpan = Math.max(root.offsetHeight - window.innerHeight, 1)
        prayaStart = THREE.MathUtils.clamp(
          (docTop(prayaSection) - animStart) / animSpan,
          0.2,
          0.9,
        )
      }

      const readScroll = () => {
        const y = window.scrollY

        target = THREE.MathUtils.clamp((y - animStart) / animSpan, 0, 1)

        // The hint has done its job the moment the page starts moving.
        hint.style.opacity = (
          1 -
          THREE.MathUtils.smoothstep(
            (y - animStart) / window.innerHeight,
            0,
            0.4,
          )
        ).toFixed(3)

        needsRender = true
      }

      // The resting camera, and the two distances the push in works to:
      // `frameDist` is as close as it can get with the whole screen still on
      // screen - that is the stage five pose - and `diveDist` is the dive
      // past it that plays out under the fade.
      let baseDist = 11
      let baseHeight = 1.5
      let frameDist = 6
      let diveDist = 3.3

      const resize = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        // updateStyle must stay on: without it the canvas element lays out at
        // its buffer size, which is devicePixelRatio times too big on phones.
        renderer.setSize(w, h)
        camera.aspect = w / h

        // Pull back (and lift slightly) on narrow/portrait viewports so the
        // laptop fits.
        baseDist = THREE.MathUtils.clamp(
          11 / Math.min(camera.aspect, 1.6),
          11,
          20,
        )
        baseHeight = 1.5 + (baseDist - 11) * 0.12

        // How close the camera can come before the panel runs off the
        // viewport: the distance at which the screen, plus a margin, still
        // fits both the vertical field of view and the horizontal one.
        const halfW = (SCREEN_SIZE[0] * macGroup.scale.x) / 2
        const halfH = (SCREEN_SIZE[1] * macGroup.scale.y) / 2
        const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360)
        frameDist = Math.min(
          Math.max(
            (halfH * SCREEN_MARGIN) / tanHalfFov,
            (halfW * SCREEN_MARGIN) / (tanHalfFov * camera.aspect),
          ),
          baseDist,
        )
        // The dive never backs away from the framed pose, however tight that
        // pose had to be on a narrow viewport.
        diveDist = Math.min(baseDist * ZOOM_FACTOR, frameDist * 0.62)

        camera.position.set(0, baseHeight, baseDist)
        camera.lookAt(lookAt)
        camera.updateProjectionMatrix()
        measure()
        needsRender = true
      }

      const applyPose = (p: number) => {
        // The run-up covers everything up to stage five; the tail carries
        // straight on from there without a pause - still pushing in, and now
        // fading out too.
        const lead = THREE.MathUtils.clamp(p / prayaStart, 0, 1)
        const tail = THREE.MathUtils.clamp(
          (p - prayaStart) / Math.max(1 - prayaStart, 0.0001),
          0,
          1,
        )
        const open = easeInOut(THREE.MathUtils.clamp(lead / OPEN_END, 0, 1))

        // Once the lid is open the laptop swings back square to the camera,
        // so stage five reads the screen head-on.
        const swing = easeInOut(
          THREE.MathUtils.clamp(lead / RECENTRE_START, 0, 1),
        )
        const recentre = easeInOut(
          THREE.MathUtils.clamp(
            (lead - RECENTRE_START) / (1 - RECENTRE_START),
            0,
            1,
          ),
        )
        macGroup.rotation.y = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(YAW_START, YAW_END, swing),
          0,
          recentre,
        )
        lidGroup.rotation.x = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, open)
        lidGroup.position.z = THREE.MathUtils.lerp(
          LID_Z_CLOSED,
          0,
          Math.min(open / 0.75, 1),
        )

        // The panel wakes as soon as the lid breaks away from the base...
        const wake = THREE.MathUtils.smoothstep(open, 0.02, 0.14)
        screenMaterial.opacity = wake * 0.96

        // ...but starts barely lit, and the backlight keeps climbing all the
        // way to the fully open position.
        const backlight = THREE.MathUtils.smoothstep(open, 0.1, 1)
        screenMaterial.color.setScalar(THREE.MathUtils.lerp(DIM, 1, backlight))
        screenLight.intensity = backlight * 1.5

        // The camera closes in behind the swing, so the laptop reaches stage
        // five three quarters pushed in and at full opacity; from there the
        // scroll keeps it coming while the scene - laptop, floor and all -
        // fades out from under it, leaving the closing panel on a clean
        // ground.
        const zoom =
          STAGE5_ZOOM * THREE.MathUtils.smoothstep(lead, ZOOM_START, 1) +
          (1 - STAGE5_ZOOM) * THREE.MathUtils.smoothstep(tail, 0, 0.85)
        if (zoom > 0) {
          macGroup.updateMatrixWorld(true)
          screenCentre.setFromMatrixPosition(screenMesh.matrixWorld)
        }
        // Up to stage five the camera closes to the framed pose and squares
        // up on the middle of the screen; past it, it dives through.
        const framed = THREE.MathUtils.clamp(zoom / STAGE5_ZOOM, 0, 1)
        const dive = THREE.MathUtils.clamp(
          (zoom - STAGE5_ZOOM) / (1 - STAGE5_ZOOM),
          0,
          1,
        )
        lookAt.set(0, THREE.MathUtils.lerp(0.95, screenCentre.y, framed), 0)
        camera.position.set(
          0,
          THREE.MathUtils.lerp(baseHeight, screenCentre.y, framed),
          THREE.MathUtils.lerp(
            THREE.MathUtils.lerp(baseDist, frameDist, framed),
            diveDist,
            dive,
          ),
        )
        camera.lookAt(lookAt)

        // Gone well before the bottom of the scroll, so the closing panel has
        // the page to itself rather than sharing it with a ghost of the
        // scene.
        container.style.opacity = (
          1 - THREE.MathUtils.smoothstep(tail, 0.15, 0.8)
        ).toFixed(3)
        finale.style.opacity = THREE.MathUtils.smoothstep(
          tail,
          0.5,
          0.85,
        ).toFixed(3)
      }

      let frame = 0
      const animate = () => {
        frame = requestAnimationFrame(animate)
        if (!ready || document.hidden) return

        const delta = target - current
        if (Math.abs(delta) < 0.0002) {
          current = target
        } else {
          current += delta * (reduceMotion ? 1 : 0.09) // inertia
          needsRender = true
        }
        if (!needsRender) return
        needsRender = false

        applyPose(current)
        renderer.render(scene, camera)
      }

      const onResize = () => {
        resize()
        readScroll()
      }

      new GLTFLoader().load(MODEL_URL, (glb) => {
        if (isDisposed()) return

        parseModel(glb)
        addScreen()
        addKeyboard()
        fitToScene()

        resize()
        readScroll()
        current = target
        applyPose(current)

        ready = true
        // The reveal is a CSS transition - applyPose has already set the
        // opacity, which starts it. The closing fade is scroll-driven, so the
        // transition is dropped once the reveal has had its time.
        const revealed = window.setTimeout(() => {
          container.style.transition = 'none'
        }, 800)
        cleanups.push(() => clearTimeout(revealed))

        window.addEventListener('scroll', readScroll, { passive: true })
        window.addEventListener('resize', onResize)
        cleanups.push(() => {
          window.removeEventListener('scroll', readScroll)
          window.removeEventListener('resize', onResize)
        })
      })

      animate()

      cleanups.push(() => {
        cancelAnimationFrame(frame)
        scene.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return
          obj.geometry.dispose()
          const mat = obj.material
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
          else mat.dispose()
        })
        renderer.dispose()
        renderer.domElement.remove()
      })
    })()

    return () => {
      disposed = true
      window.removeEventListener('resize', fitIntro)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    // The hero is dark whatever the site theme: the scene, the glass panels
    // and the screenshot are all built for a dark ground.
    <div ref={rootRef} className="relative bg-[#0e1013] text-[#e7e9ee]">
      <div
        ref={sceneRef}
        className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-700 [&>canvas]:block"
        style={{
          // Feathered so the canvas dissolves, rather than cuts, when it is
          // released and travels up over the closing panel.
          maskImage: 'linear-gradient(to bottom, #000 84%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, #000 84%, transparent 100%)',
        }}
      />

      <div className="pointer-events-none relative z-10">
        {/* Stage one carries no copy, just the hint that there is more below. */}
        <section
          ref={introRef}
          className="flex min-h-[100svh] items-end justify-center px-[8vw] pb-[50px]"
        >
          <p ref={hintRef} className="text-[13px] text-[#6f7684]">
            {copy.scrollHint}
          </p>
        </section>

        <Panel>
          <Card>
            <h1 className="mb-3 text-[clamp(28px,5vw,44px)] font-bold leading-[1.12] tracking-[-0.02em]">
              {italiciseName(copy.heroTitle)}
            </h1>
            <p className="text-[#a7adba]">{copy.heroTagline}</p>
          </Card>
        </Panel>

        <Panel>
          <Card>
            <h2 className="mb-2.5 text-[clamp(20px,3.4vw,30px)] font-bold leading-[1.15] tracking-[-0.02em]">
              {copy.panel2Title}
            </h2>
            <p className="text-[#a7adba]">{copy.panel2Body}</p>
          </Card>
        </Panel>

        <Panel>
          <Card>
            <h2 className="mb-2.5 text-[clamp(20px,3.4vw,30px)] font-bold leading-[1.15] tracking-[-0.02em]">
              {copy.panel3Title}
            </h2>
            <p className="text-[#a7adba]">{copy.panel3Body}</p>
            <a
              href={copy.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              // The panels ignore the pointer so they never block the canvas;
              // links opt back in.
              className="pointer-events-auto mt-4 inline-block text-[15px] text-[#7aa8ff] underline-offset-4 hover:underline"
            >
              {copy.learnMore} &rarr;
            </a>
          </Card>
        </Panel>

        {/* Stage five: the laptop has arrived square to the camera and half
            pushed in, so the card sits low and centred under it rather than
            out in the left column. */}
        <section
          ref={prayaRef}
          className="flex min-h-[70svh] items-end justify-center px-[8vw] pb-[6vh]"
        >
          <Card className="text-center">
            <h2 className="mb-2.5 text-[clamp(20px,3.4vw,30px)] font-bold leading-[1.15] tracking-[-0.02em]">
              {copy.panel4Title}
            </h2>
            <p className="text-[#a7adba]">
              {linkName(copy.panel4Body, 'Praya', copy.prayaUrl)}
            </p>
            <a
              href={copy.prayaLearnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              // The panels ignore the pointer so they never block the canvas;
              // links opt back in.
              className="pointer-events-auto mt-4 inline-block text-[15px] text-[#7aa8ff] underline-offset-4 hover:underline"
            >
              {copy.learnMore} &rarr;
            </a>
          </Card>
        </section>

        {/* No copy here: it is the scroll room the camera needs to finish
            pushing in and fade the scene out. */}
        <section aria-hidden className="min-h-[90svh]" />

        <section className="flex min-h-[100svh] items-center justify-center px-[8vw] text-center">
          <div ref={finaleRef} className="opacity-0">
            {/* Boni closes the page in place of the line of copy, which
                carries on as the alt text. */}
            <img
              src={BONI_IMAGE}
              alt={copy.comingSoon}
              className="mx-auto mb-6 h-[clamp(170px,30vh,300px)] w-auto"
            />
            <p className="mx-auto mb-7 text-[13px] leading-relaxed text-[#6f7684]">
              {copy.credit.map((line, i) => (
                <span key={i} className="block">
                  {italiciseName(line)}
                </span>
              ))}
              <Link
                to="/$lang/revival"
                params={{ lang }}
                className="pointer-events-auto inline-block text-[#7aa8ff] underline-offset-4 hover:underline"
              >
                {copy.creditLink} &rarr;
              </Link>
            </p>
            {/* The three ways in. They stack on a narrow viewport rather
                than shrinking to fit. */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/$lang/download"
                params={{ lang }}
                className={CTA_CLASS}
              >
                {copy.ctaDownload}
              </Link>
              <a
                href={copy.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                {copy.ctaEngage}
              </a>
              <a
                href={copy.contributeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                {copy.ctaContribute}
              </a>
              <a
                href={copy.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                {copy.ctaDonate}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// The closing calls to action. The panels ignore the pointer so they never
// block the canvas; these opt back in.
const CTA_CLASS =
  'pointer-events-auto min-w-[9.5rem] rounded-full border border-white/15 bg-white/5 px-8 py-4 text-[17px] font-medium text-[#e7e9ee] transition hover:-translate-y-px hover:border-[#7aa8ff]/50 hover:bg-[#7aa8ff]/15 max-sm:w-full'

// The desktop is named after a town, so the name carries a link out to it
// wherever the copy mentions it.
function linkName(text: string, name: string, url: string) {
  return text.split(new RegExp(`(${name})`, 'g')).map((part, i) =>
    part === name ? (
      <a
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        // The panels ignore the pointer so they never block the canvas; links
        // opt back in.
        className="pointer-events-auto text-[#7aa8ff] underline underline-offset-4 decoration-[#7aa8ff]/40 hover:decoration-[#7aa8ff]"
      >
        {part}
      </a>
    ) : (
      part
    ),
  )
}

// The product name is set in italic wherever it appears in the copy.
function italiciseName(text: string) {
  return text
    .split(/(Sinambung)/g)
    .map((part, i) => (part === 'Sinambung' ? <em key={i}>{part}</em> : part))
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    // Up to 1280px the card sits 8vw from the left edge. Past that it stops
    // drifting outward and holds to a centred 1280px column instead, so on a
    // wide monitor it stays left of the laptop rather than out at the margin.
    <section className="flex min-h-[70svh] items-center pl-[max(8vw,calc((100vw-1280px)/2+102px))] pr-[8vw] max-md:items-end max-md:pb-[10vh]">
      {children}
    </section>
  )
}

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`max-w-[34ch] rounded-2xl border border-white/10 bg-[#0e1013]/55 px-[26px] py-6 backdrop-blur-lg max-md:max-w-full ${className}`}
    >
      {children}
    </div>
  )
}
