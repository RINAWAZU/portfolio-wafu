'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, type BufferGeometry, Color, type DirectionalLight, type Group, Mesh, Vector3 } from 'three';
import { seasonLightAt } from '@/lib/season';
import { useSeasonBlend } from '@/hooks/useSeasonBlend';
import { getSeasonBlend } from '@/lib/seasonRuntime';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Draco デコーダは self-host する（gstatic の CDN に本番の初期表示を依存させない）。 */
const DRACO_DECODER_PATH = '/draco/';

/** 呼吸の周期（秒）。BonsaiImage の CSS アニメーションと揃える。 */
const BREATH_PERIOD = 9;

export interface BonsaiModelProps {
  readonly src: string;
}

function findFirstGeometry(scene: Group): BufferGeometry | undefined {
  const meshes: Mesh[] = [];
  scene.traverse((object) => {
    if (object instanceof Mesh) meshes.push(object);
  });
  return meshes[0]?.geometry;
}

/** 法線の Z 成分の平均。レリーフが裏返って読み込まれていないかの判定に使う。 */
function averageNormalZ(geometry: BufferGeometry): number {
  const normal = geometry.getAttribute('normal');
  let sum = 0;
  for (let i = 0; i < normal.count; i += 1) sum += normal.getZ(i);
  return sum / Math.max(1, normal.count);
}

/**
 * 読み込んだレリーフを「正面を向いた高さ1の板」に正規化する。
 *
 * 素材は写真から起こした浮き彫り（厚み方向が極端に薄い）で、書き出しツールによって
 * 厚みが X/Y/Z のどの軸に来るかが変わる。軸を決め打ちにすると差し替えた瞬間に
 * 破綻するため、実測して向きを決める。
 */
function prepareGeometry(source: BufferGeometry): BufferGeometry {
  const geometry = source.clone();

  // 圧縮時に法線を捨てているのでここで生成する。面ごとではなく隣接面を平均した
  // 法線になるため、写真起こしのレリーフがざらつかずに滑らかに見える。
  geometry.computeVertexNormals();

  geometry.computeBoundingBox();
  const box = geometry.boundingBox ?? new Box3();
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  geometry.translate(-center.x, -center.y, -center.z);

  // 最も薄い軸＝レリーフの厚み。それをカメラ方向（+Z）へ向ける。
  if (size.x <= size.y && size.x <= size.z) geometry.rotateY(Math.PI / 2);
  else if (size.y <= size.z) geometry.rotateX(-Math.PI / 2);

  // 厚みが +Z / -Z のどちらを向くかは不定。裏返しだと凹んで見えるので向きを揃える。
  if (averageNormalZ(geometry) < 0) geometry.rotateY(Math.PI);

  geometry.computeBoundingBox();
  const fitted = (geometry.boundingBox ?? new Box3()).getSize(new Vector3());
  geometry.scale(1 / Math.max(fitted.x, fitted.y), 1 / Math.max(fitted.x, fitted.y), 1 / Math.max(fitted.x, fitted.y));

  return geometry;
}

interface ReliefProps {
  readonly src: string;
  readonly animated: boolean;
}

function Relief({ src, animated }: ReliefProps) {
  const { scene } = useGLTF(src, DRACO_DECODER_PATH);
  const geometry = useMemo(() => {
    const source = findFirstGeometry(scene);
    return source ? prepareGeometry(source) : undefined;
  }, [scene]);

  // dominant が変わったときだけ再レンダリングされる（ページ全体で最大3回・§11）。
  // reduced-motion のときはこれだけが光の更新手段になる。
  const blend = useSeasonBlend();
  const light = seasonLightAt(blend);
  const keyColor = useMemo(() => new Color(light.r, light.g, light.b), [light.r, light.g, light.b]);

  const meshRef = useRef<Mesh>(null);
  const keyRef = useRef<DirectionalLight>(null);

  useFrame((state) => {
    if (!animated) return;

    // 連続値は React を経由せず直接書き込む。ここで setState を呼ぶと
    // スクロール中に毎フレーム再レンダリングが走り T15 の条件を壊す。
    const current = seasonLightAt(getSeasonBlend());
    const key = keyRef.current;
    const mesh = meshRef.current;
    const phase = (state.clock.elapsedTime / BREATH_PERIOD) * Math.PI * 2;

    if (key) {
      key.color.setRGB(current.r, current.g, current.b);
      key.intensity = current.keyIntensity;
      // 斜光をゆっくり振る。レリーフの凹凸は光の角度でしか立たないため、
      // これが「呼吸」の主役になる（形そのものはほとんど動かさない）。
      key.position.set(-1.1 + Math.sin(phase) * 0.08, 1.25 + Math.cos(phase) * 0.05, 1.6);
    }
    if (mesh) mesh.scale.setScalar(1 + Math.sin(phase) * 0.008);
  });

  if (!geometry) return null;

  return (
    <>
      <ambientLight intensity={light.ambientIntensity} />
      <directionalLight ref={keyRef} position={[-1.1, 1.25, 1.6]} intensity={light.keyIntensity} color={keyColor} />
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.86} metalness={0} />
      </mesh>
    </>
  );
}

/**
 * 3D 実装（F03）。額縁（BonsaiFigure）は一切知らない中身の差し替え点（設計書 §6-3）。
 *
 * 彩度・明度は静止画実装と同じ `--season-filter` を Canvas ごとに掛けて揃える。
 * WebGL 側が担当するのは、CSS では出せない「立体の陰影」だけ。
 */
export default function BonsaiModel({ src }: BonsaiModelProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animated = !prefersReducedMotion;

  return (
    <div className="relative h-full w-full" style={{ filter: 'var(--season-filter)' }}>
      <Canvas
        // reduced-motion では rAF を回し続けない。季節が変わったときだけ描き直す。
        frameloop={animated ? 'always' : 'demand'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 2.6], fov: 24 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Relief src={src} animated={animated} />
        </Suspense>
      </Canvas>
    </div>
  );
}
