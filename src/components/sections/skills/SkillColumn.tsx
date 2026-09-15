import type { SkillGroup } from '@/types/content';
import { SkillLevelBar } from './SkillLevelBar';

export interface SkillColumnProps {
  readonly group: SkillGroup;
}

/**
 * カテゴリ1列(設計書 §6-4)。欧文ラベルは真朱(生成面の欧文ラベル規約 §1-6)。
 *
 * セル内は左右対称のパディングを取る(ワイヤーフレーム #3a: 中間カラムは `padding:14px 14px 0`)。
 * 片側だけだと内容が罫線に張り付いて「左詰め」に見えるため。
 * 先頭カラムの左・最終カラムの右だけはセクションの余白と揃えるため 0 にする。
 */
export function SkillColumn({ group }: SkillColumnProps) {
  return (
    <div className="py-6 lg:border-r lg:border-hairline-dark lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
      <p className="font-latin text-xs tracking-latin text-shinshu uppercase">
        {group.no} {group.label}
      </p>
      <ul className="mt-3 flex flex-col gap-2.5 font-mincho text-sm text-sumi">
        {group.items.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-3">
            {/* `min-w-0`: フレックス項目の自動最小幅（min-content）を解除しないと、
                狭い画面で技術名が縮まず目盛りごと画面外へ押し出される。 */}
            <span className="min-w-0 break-words">{item.name}</span>
            <SkillLevelBar level={item.level} />
          </li>
        ))}
      </ul>
    </div>
  );
}
