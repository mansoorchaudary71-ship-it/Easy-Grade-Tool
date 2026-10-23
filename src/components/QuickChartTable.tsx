import React, { memo } from 'react';
import { ScrollableTableContainer } from './ScrollableTableContainer';
import { gradeTone } from '../utils/gradeTone';
import { aOrAn } from '../data/gradingScaleSizes';

export interface QuickChartItem {
  wrong: number;
  percentage: number;
  letter: string;
  text: string;
}

export interface QuickChartGroup {
  letter: string;
  minThreshold: number;
  items: QuickChartItem[];
}

interface QuickChartTableProps {
  groups: QuickChartGroup[];
  total: number;
  /** Lowest passing percentage, used for the "F" band label. */
  lowestPassing: number;
  /** Wrong-answer count currently loaded in the student panel (screen only). */
  selectedWrong?: number | null;
  /** When set, rows are tappable and load that wrong-answer count into the student panel. */
  onPick?: (wrong: number) => void;
  /** Print copy: no scroll box, no sticky header, plain text cells. */
  printView?: boolean;
  /** Max height class for the scroll box on screen. */
  maxHeightClassName?: string;
}

const formatStep = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

const TH_BASE =
  'px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-600';
/** Sticky header cells: each <th> sticks (more reliable than sticking the <thead>/<tr> across browsers). */
const TH_STICKY = 'sticky top-0 z-20 shadow-[0_1px_0_0_rgb(148_163_184/0.6)] dark:shadow-[0_1px_0_0_rgb(71_85_105)]';

interface RowProps {
  item: QuickChartItem;
  total: number;
  selected: boolean;
  onPick?: (wrong: number) => void;
  printView?: boolean;
}

/** One chart row. Colour tints the row, but the grade letter, icon and label say the same thing in words and shape. */
const ChartRow = memo<RowProps>(({ item, total, selected, onPick, printView }) => {
  const tone = gradeTone(item.letter);
  const Icon = tone.Icon;
  const correct = formatStep(total - item.wrong);

  const rowClass = `${tone.row} ${
    selected ? 'outline outline-2 -outline-offset-2 outline-blue-600 dark:outline-blue-400' : ''
  } ${onPick ? 'cursor-pointer hover:brightness-[0.97] dark:hover:brightness-110' : ''}`;

  const cellBorder = 'border-b border-slate-200 dark:border-slate-700/70';

  return (
    <tr className={`ez-chart-row ${rowClass}`} onClick={onPick ? () => onPick(item.wrong) : undefined}>
      <th
        scope="row"
        className={`border-l-4 ${tone.rule} ${cellBorder} p-0 text-left text-sm font-medium text-slate-900 dark:text-slate-100`}
      >
        {onPick ? (
          <button
            type="button"
            aria-pressed={selected}
            aria-label={`${item.wrong} wrong, ${item.text}%, grade ${item.letter}. Use for the current student.`}
            onClick={(e) => {
              e.stopPropagation();
              onPick(item.wrong);
            }}
            className="ez-chart-pick flex min-h-11 w-full min-w-[44px] cursor-pointer items-center px-3 py-2 text-left font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
          >
            <span className="font-mono tabular-nums">{formatStep(item.wrong)}</span>
            <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">wrong</span>
          </button>
        ) : (
          <span className="flex min-h-9 items-center px-3 py-1.5 font-semibold">
            <span className="font-mono tabular-nums">{formatStep(item.wrong)}</span>
            <span className="ml-1 font-medium">wrong</span>
          </span>
        )}
      </th>
      <td className={`${cellBorder} px-3 py-2 text-right font-mono text-sm tabular-nums text-slate-800 dark:text-slate-200`}>
        {correct}
        <span className="text-slate-600 dark:text-slate-400">/{total}</span>
      </td>
      <td className={`${cellBorder} px-3 py-2 text-right font-mono text-base font-bold tabular-nums ${tone.text}`}>
        {item.text}%
      </td>
      <td className={`${cellBorder} px-3 py-2 text-right`}>
        <span
          className={`inline-flex min-w-[3.5rem] items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-sm font-bold ${tone.badge}`}
        >
          <Icon className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <span>{item.letter}</span>
          <span className="sr-only">, {tone.label}</span>
        </span>
      </td>
    </tr>
  );
});
ChartRow.displayName = 'ChartRow';

/**
 * The Quick Chart as a real, accessible data table.
 *  - sticky column headers, so the column is still labelled while the chart scrolls
 *  - grouped by letter grade with a header row per group (semantic green / amber / rose, never colour-only)
 *  - on narrow screens the table scrolls sideways and shows an edge shadow while more content is hidden
 *  - rows are 44px+ tall when tappable
 */
export const QuickChartTable: React.FC<QuickChartTableProps> = ({
  groups,
  total,
  lowestPassing,
  selectedWrong = null,
  onPick,
  printView = false,
  maxHeightClassName = 'max-h-[560px]',
}) => {
  const table = (
    <table
      className={`ez-chart-table w-full min-w-[18rem] ${printView ? 'border-collapse' : 'border-separate border-spacing-0'} text-sm`}
    >
      <caption className="sr-only">
        Scores for 0 to {total} wrong answers on a {total}-question test, grouped by letter grade. Columns: wrong answers,
        correct answers, percentage and letter grade.
      </caption>
      <thead>
        <tr>
          <th scope="col" className={`${TH_BASE} ${printView ? '' : TH_STICKY} text-left`}>
            Wrong
          </th>
          <th scope="col" className={`${TH_BASE} ${printView ? '' : TH_STICKY} text-right`}>
            Correct
          </th>
          <th scope="col" className={`${TH_BASE} ${printView ? '' : TH_STICKY} text-right`}>
            Score
          </th>
          <th scope="col" className={`${TH_BASE} ${printView ? '' : TH_STICKY} text-right`}>
            Grade
          </th>
        </tr>
      </thead>
      {groups.map((group) => {
        const tone = gradeTone(group.letter);
        const Icon = tone.Icon;
        return (
          <tbody key={group.letter} className="ez-chart-group">
            <tr>
              <th
                scope="rowgroup"
                colSpan={4}
                className={`border-y px-3 py-2 text-left text-sm font-bold ${tone.surface} ${tone.text}`}
              >
                <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                  <span className="inline-flex items-center gap-2">
                    <Icon className="size-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    <span>Grade {group.letter}</span>
                    <span className="font-medium">· {tone.label}</span>
                  </span>
                  <span className="font-mono text-xs font-semibold">
                    {group.letter === 'F' ? `below ${lowestPassing}%` : `${group.minThreshold}% and up`}
                  </span>
                </span>
              </th>
            </tr>
            {group.items.map((item) => (
              <ChartRow
                key={item.wrong}
                item={item}
                total={total}
                selected={selectedWrong === item.wrong}
                onPick={onPick}
                printView={printView}
              />
            ))}
          </tbody>
        );
      })}
    </table>
  );

  if (printView) return table;

  return (
    <ScrollableTableContainer
      ariaLabel={`Quick grade chart for ${aOrAn(total)} ${total}-question test`}
      maxHeightClassName={maxHeightClassName}
      className="rounded-xl border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"
    >
      {table}
    </ScrollableTableContainer>
  );
};

export default QuickChartTable;
