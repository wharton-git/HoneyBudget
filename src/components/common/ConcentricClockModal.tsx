import { component$, useStore, $, useVisibleTask$, type PropFunction } from '@builder.io/qwik';
import { SvgIcon } from '../icons/SvgIcon';

interface ConcentricClockModalProps {
  isOpen: boolean;
  initialHour?: string;
  initialMinute?: string;
  onClose$: PropFunction<() => void>;
  onSelect$: PropFunction<(hour: string, minute: string) => void>;
}

export const ConcentricClockModal = component$<ConcentricClockModalProps>(({
  isOpen,
  initialHour = '12',
  initialMinute = '00',
  onClose$,
  onSelect$,
}) => {
  const state = useStore({
    hour: parseInt(initialHour, 10) || 12,
    minute: parseInt(initialMinute, 10) || 0,
    activeUnit: 'hour' as 'hour' | 'minute',
    isDragging: false,
    dragTarget: 'hour' as 'hour' | 'minute',
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => isOpen);
    if (!isOpen) return;

    const parsedH = parseInt(initialHour, 10);
    const parsedM = parseInt(initialMinute, 10);
    state.hour = isNaN(parsedH) ? 12 : (parsedH % 24 + 24) % 24;
    state.minute = isNaN(parsedM) ? 0 : (parsedM % 60 + 60) % 60;
    state.activeUnit = 'hour';
    state.isDragging = false;
  });

  const handlePointerAction$ = $((e: any, isStart = false) => {
    const svg = e.currentTarget as SVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const scaleX = 340 / rect.width;
    const scaleY = 340 / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;

    const dx = px - 170;
    const dy = py - 170;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    let target: 'hour' | 'minute' = state.dragTarget;
    if (isStart) {
      target = dist <= 104 ? 'hour' : 'minute';
      state.dragTarget = target;
      state.activeUnit = target;
      state.isDragging = true;
    }

    if (target === 'hour') {
      const h = Math.round(deg / 15) % 24;
      state.hour = h;
    } else {
      const m = Math.round(deg / 6) % 60;
      state.minute = m;
    }
  });

  const handleSetNow$ = $(() => {
    const now = new Date();
    state.hour = now.getHours();
    state.minute = now.getMinutes();
  });

  const handleConfirm$ = $(() => {
    const hStr = String(state.hour).padStart(2, '0');
    const mStr = String(state.minute).padStart(2, '0');
    onSelect$(hStr, mStr);
    onClose$();
  });

  if (!isOpen) return null;

  // Concentric circle geometry constants
  const cx = 170;
  const cy = 170;
  const rHour = 76;
  const rMin = 132;

  // Selected hour coordinates & angle
  const hourAngle = -90 + state.hour * 15;
  const hourRad = (hourAngle * Math.PI) / 180;
  const hourX = cx + rHour * Math.cos(hourRad);
  const hourY = cy + rHour * Math.sin(hourRad);

  // Selected minute coordinates & angle
  const minAngle = -90 + state.minute * 6;
  const minRad = (minAngle * Math.PI) / 180;
  const minX = cx + rMin * Math.cos(minRad);
  const minY = cy + rMin * Math.sin(minRad);

  // 24 hours list
  const hours = Array.from({ length: 24 }).map((_, i) => {
    const a = -90 + i * 15;
    const rad = (a * Math.PI) / 180;
    return {
      hour: i,
      x: cx + rHour * Math.cos(rad),
      y: cy + rHour * Math.sin(rad),
      isSelected: i === state.hour,
    };
  });

  // Multiples of 5 minutes list
  const minuteMultiples = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => {
    const a = -90 + m * 6;
    const rad = (a * Math.PI) / 180;
    return {
      minute: m,
      label: String(m).padStart(2, '0'),
      x: cx + rMin * Math.cos(rad),
      y: cy + rMin * Math.sin(rad),
      isSelected: m === state.minute,
    };
  });

  // 60 tick lines on outer rim
  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const a = -90 + i * 6;
    const rad = (a * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const rInner = isMajor ? 149 : 153;
    const rOuter = isMajor ? 159 : 157;
    return {
      index: i,
      x1: cx + rInner * Math.cos(rad),
      y1: cy + rInner * Math.sin(rad),
      x2: cx + rOuter * Math.cos(rad),
      y2: cy + rOuter * Math.sin(rad),
      isMajor,
    };
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-amber-950/45 backdrop-blur-xs animate-in fade-in">
      <div class="bg-white rounded-3xl border-2 border-amber-200 shadow-2xl max-w-sm w-full p-4 sm:p-5 space-y-4">
        {/* Header */}
        <div class="flex items-center justify-between pb-2 border-b border-amber-100">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <SvgIcon name="clock" size={16} />
            </div>
            <div>
              <h3 class="text-sm font-black text-amber-950 leading-tight">
                Sélection de l'heure
              </h3>
              <span class="text-[10px] font-semibold text-slate-500">
                Double cadran concentrique
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick$={onClose$}
            class="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
            title="Fermer"
          >
            <SvgIcon name="x" size={16} />
          </button>
        </div>

        {/* Big Digital Readout */}
        <div class="flex items-center justify-center gap-2 sm:gap-3 py-1">
          <button
            type="button"
            onClick$={() => (state.activeUnit = 'hour')}
            class={`px-4 py-2 rounded-2xl border-2 transition-all cursor-pointer text-center ${
              state.activeUnit === 'hour'
                ? 'bg-amber-400 text-amber-950 border-amber-500 font-black shadow-xs ring-2 ring-amber-300'
                : 'bg-amber-50/70 text-amber-900 border-amber-200 font-bold hover:bg-amber-100'
            }`}
          >
            <span class="text-2xl font-black block tracking-tight">
              {String(state.hour).padStart(2, '0')}
            </span>
            <span class="text-[9px] uppercase tracking-wider block font-bold text-amber-900/80">
              Heure (0-23)
            </span>
          </button>

          <span class="text-2xl font-black text-amber-900 pb-3">:</span>

          <button
            type="button"
            onClick$={() => (state.activeUnit = 'minute')}
            class={`px-4 py-2 rounded-2xl border-2 transition-all cursor-pointer text-center ${
              state.activeUnit === 'minute'
                ? 'bg-amber-500 text-white border-amber-600 font-black shadow-xs ring-2 ring-amber-300'
                : 'bg-amber-50/70 text-amber-900 border-amber-200 font-bold hover:bg-amber-100'
            }`}
          >
            <span class="text-2xl font-black block tracking-tight">
              {String(state.minute).padStart(2, '0')}
            </span>
            <span class="text-[9px] uppercase tracking-wider block font-bold text-amber-900/80">
              Minute (0-59)
            </span>
          </button>
        </div>

        {/* The 2 Concentric Circles Dial */}
        <div class="relative w-full max-w-[290px] sm:max-w-[310px] mx-auto select-none touch-none">
          <svg
            viewBox="0 0 340 340"
            class="w-full h-auto cursor-pointer"
            onPointerDown$={(e) => handlePointerAction$(e, true)}
            onPointerMove$={(e) => {
              if (state.isDragging) {
                handlePointerAction$(e, false);
              }
            }}
            onPointerUp$={() => (state.isDragging = false)}
            onPointerLeave$={() => (state.isDragging = false)}
          >
            {/* Background Dial Base */}
            <circle
              cx={cx}
              cy={cy}
              r={163}
              fill="#FFFDF7"
              stroke="#FDE68A"
              stroke-width="2"
            />

            {/* Boundary circle between Minute Ring and Hour Ring */}
            <circle
              cx={cx}
              cy={cy}
              r={105}
              fill="#FEF3C7"
              fill-opacity="0.35"
              stroke="#FCD34D"
              stroke-width="1.5"
              stroke-dasharray="3 3"
            />

            {/* Inner Hub Circle */}
            <circle
              cx={cx}
              cy={cy}
              r={46}
              fill="#FFFFFF"
              stroke="#FDE68A"
              stroke-width="1.5"
            />

            {/* Outer minutes guideline circle */}
            <circle
              cx={cx}
              cy={cy}
              r={rMin}
              fill="none"
              stroke="#F59E0B"
              stroke-width="1"
              stroke-opacity="0.25"
            />

            {/* Inner hours guideline circle */}
            <circle
              cx={cx}
              cy={cy}
              r={rHour}
              fill="none"
              stroke="#F59E0B"
              stroke-width="1"
              stroke-opacity="0.3"
            />

            {/* Minute ticks on outer perimeter */}
            {ticks.map((t) => (
              <line
                key={`tick-${t.index}`}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.isMajor ? '#D97706' : '#FCD34D'}
                stroke-width={t.isMajor ? 1.8 : 1}
                stroke-linecap="round"
              />
            ))}

            {/* Minute Hand Line (pointing to outer circle) */}
            <line
              x1={cx}
              y1={cy}
              x2={minX}
              y2={minY}
              stroke="#D97706"
              stroke-width={state.activeUnit === 'minute' ? 3 : 2}
              stroke-linecap="round"
              stroke-dasharray={state.activeUnit === 'minute' ? undefined : '3 3'}
            />

            {/* Hour Hand Line (pointing to inner circle) */}
            <line
              x1={cx}
              y1={cy}
              x2={hourX}
              y2={hourY}
              stroke="#F59E0B"
              stroke-width={state.activeUnit === 'hour' ? 4 : 3}
              stroke-linecap="round"
            />

            {/* Center pin decoration */}
            <circle cx={cx} cy={cy} r={7} fill="#78350F" />
            <circle cx={cx} cy={cy} r={3} fill="#FFFDF7" />

            {/* Selected Minute Target Badge */}
            <circle
              cx={minX}
              cy={minY}
              r={12}
              fill="#D97706"
              stroke="#FFFFFF"
              stroke-width="1.5"
            />
            <text
              x={minX}
              y={minY}
              text-anchor="middle"
              dominant-baseline="central"
              font-size="10"
              font-weight="900"
              fill="#FFFFFF"
            >
              {String(state.minute).padStart(2, '0')}
            </text>

            {/* Outer Circle (Minutes 0 to 59: Multiples of 5) */}
            {minuteMultiples.map((m) => {
              if (m.minute === state.minute) return null; // already rendered by selected badge
              return (
                <g
                  key={`m-${m.minute}`}
                  onClick$={() => {
                    state.minute = m.minute;
                    state.activeUnit = 'minute';
                  }}
                  class="cursor-pointer"
                >
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={11}
                    fill="transparent"
                  />
                  <text
                    x={m.x}
                    y={m.y}
                    text-anchor="middle"
                    dominant-baseline="central"
                    font-size="10"
                    font-weight="700"
                    fill="#92400E"
                  >
                    {m.label}
                  </text>
                </g>
              );
            })}

            {/* Selected Hour Target Badge */}
            <circle
              cx={hourX}
              cy={hourY}
              r={10.5}
              fill="#F59E0B"
              stroke="#451A03"
              stroke-width="1"
            />
            <text
              x={hourX}
              y={hourY}
              text-anchor="middle"
              dominant-baseline="central"
              font-size="9"
              font-weight="900"
              fill="#451A03"
            >
              {state.hour}
            </text>

            {/* Inner Circle (Hours 0 to 23) */}
            {hours.map((h) => {
              if (h.hour === state.hour) return null; // already rendered by selected badge
              return (
                <g
                  key={`h-${h.hour}`}
                  onClick$={() => {
                    state.hour = h.hour;
                    state.activeUnit = 'hour';
                  }}
                  class="cursor-pointer"
                >
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={9.5}
                    fill="transparent"
                  />
                  <text
                    x={h.x}
                    y={h.y}
                    text-anchor="middle"
                    dominant-baseline="central"
                    font-size="8.5"
                    font-weight="700"
                    fill="#78350F"
                  >
                    {h.hour}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend describing the two concentric circles */}
        <div class="grid grid-cols-2 gap-2 text-[10px] font-bold">
          <div class="flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-200">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 shrink-0"></span>
            <span>1er cercle : Heures (0 à 23)</span>
          </div>

          <div class="flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-200">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-700 shrink-0"></span>
            <span>2nd cercle : Minutes (0 à 59)</span>
          </div>
        </div>

        {/* Presets and Steppers */}
        <div class="flex items-center justify-between gap-1 pt-1">
          <div class="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick$={handleSetNow$}
              class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 cursor-pointer"
            >
              Maintenant
            </button>
            <button
              type="button"
              onClick$={() => {
                state.hour = 12;
                state.minute = 0;
              }}
              class="px-2 py-1 text-[11px] font-bold rounded-lg bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 cursor-pointer"
            >
              12:00
            </button>
            <button
              type="button"
              onClick$={() => {
                state.hour = 19;
                state.minute = 0;
              }}
              class="px-2 py-1 text-[11px] font-bold rounded-lg bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 cursor-pointer"
            >
              19:00
            </button>
          </div>

          <div class="flex items-center gap-1">
            <button
              type="button"
              onClick$={() => (state.minute = (state.minute - 5 + 60) % 60)}
              class="px-1.5 py-1 text-[10px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 cursor-pointer"
              title="-5 minutes"
            >
              -5m
            </button>
            <button
              type="button"
              onClick$={() => (state.minute = (state.minute + 5) % 60)}
              class="px-1.5 py-1 text-[10px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 cursor-pointer"
              title="+5 minutes"
            >
              +5m
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div class="flex items-center justify-end gap-2 pt-3 border-t border-amber-100">
          <button
            type="button"
            onClick$={onClose$}
            class="px-4 py-2 text-xs font-bold rounded-xl text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick$={handleConfirm$}
            class="px-5 py-2.5 text-xs font-black rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <SvgIcon name="check" size={14} />
            <span>Valider l'heure</span>
          </button>
        </div>
      </div>
    </div>
  );
});
