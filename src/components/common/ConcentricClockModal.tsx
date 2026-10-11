import { component$, useStore, $, useVisibleTask$, type PropFunction } from '@builder.io/qwik';
import { SvgIcon } from '../icons/SvgIcon';

interface ConcentricClockModalProps {
  isOpen: boolean;
  initialHour?: string; // 24h string (e.g. "14" or "09")
  initialMinute?: string;
  onClose$: PropFunction<() => void>;
  onSelect$: PropFunction<(hour24: string, minute: string, period?: 'AM' | 'PM') => void>;
}

export const ConcentricClockModal = component$<ConcentricClockModalProps>(({
  isOpen,
  initialHour = '12',
  initialMinute = '00',
  onClose$,
  onSelect$,
}) => {
  const state = useStore({
    hour12: 12,
    minute: 0,
    period: 'PM' as 'AM' | 'PM',
    activeUnit: 'hour' as 'hour' | 'minute',
    minuteStepMode: 'step5' as 'step5' | 'step1',
    isDragging: false,
    dragTarget: 'hour' as 'hour' | 'minute',
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => isOpen);
    if (!isOpen) return;

    const parsedH = parseInt(initialHour, 10);
    const parsedM = parseInt(initialMinute, 10);

    const safeH = isNaN(parsedH) ? 12 : ((parsedH % 24) + 24) % 24;
    state.period = safeH >= 12 ? 'PM' : 'AM';
    let h12 = safeH % 12;
    if (h12 === 0) h12 = 12;
    state.hour12 = h12;

    state.minute = isNaN(parsedM) ? 0 : ((parsedM % 60) + 60) % 60;
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
      let h = Math.round(deg / 30) % 12;
      if (h === 0) h = 12;
      state.hour12 = h;
    } else {
      let m = Math.round(deg / 6) % 60;
      if (state.minuteStepMode === 'step5') {
        m = (Math.round(m / 5) * 5) % 60;
      }
      state.minute = m;
    }
  });

  const handleSetNow$ = $(() => {
    const now = new Date();
    const h24 = now.getHours();
    state.period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    state.hour12 = h12;
    state.minute = now.getMinutes();
  });

  const handleConfirm$ = $(() => {
    let h24 = state.hour12 % 12;
    if (state.period === 'PM') {
      h24 += 12;
    }
    const hStr = String(h24).padStart(2, '0');
    const mStr = String(state.minute).padStart(2, '0');
    onSelect$(hStr, mStr, state.period);
    onClose$();
  });

  if (!isOpen) return null;

  // Concentric circle geometry constants
  const cx = 170;
  const cy = 170;
  const rHour = 76;
  const rMin = 132;

  // Selected 12-hour angle & coordinates (12 is at -90 deg, 1 at -60 deg...)
  const hourAngle = -90 + (state.hour12 % 12) * 30;
  const hourRad = (hourAngle * Math.PI) / 180;
  const hourX = cx + rHour * Math.cos(hourRad);
  const hourY = cy + rHour * Math.sin(hourRad);

  // Selected minute angle & coordinates
  const minAngle = -90 + state.minute * 6;
  const minRad = (minAngle * Math.PI) / 180;
  const minX = cx + rMin * Math.cos(minRad);
  const minY = cy + rMin * Math.sin(minRad);

  // 12 hours list (1 to 12)
  const hours12List = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
    const a = -90 + (h % 12) * 30;
    const rad = (a * Math.PI) / 180;
    return {
      hour: h,
      x: cx + rHour * Math.cos(rad),
      y: cy + rHour * Math.sin(rad),
      isSelected: h === state.hour12,
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
      <div class="bg-white rounded-3xl border-2 border-amber-200 shadow-2xl max-w-sm w-full p-5 sm:p-6 space-y-4">
        {/* Header - Simple & Clean */}
        <div class="flex items-center justify-between pb-2 border-b border-amber-100">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-2xs">
              <SvgIcon name="clock" size={18} />
            </div>
            <h3 class="text-base font-black text-amber-950">
              Heure
            </h3>
          </div>

          <button
            type="button"
            onClick$={onClose$}
            class="p-2 rounded-full hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
            title="Fermer"
          >
            <SvgIcon name="x" size={18} />
          </button>
        </div>

        {/* Digital Readout & AM/PM Toggle - Large & Prominent Buttons */}
        <div class="flex items-center justify-center gap-3 py-1">
          {/* Hour Button (1-12) */}
          <button
            type="button"
            onClick$={() => (state.activeUnit = 'hour')}
            class={`px-5 py-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
              state.activeUnit === 'hour'
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span class="text-3xl font-black block tracking-tight">
              {String(state.hour12).padStart(2, '0')}
            </span>
          </button>

          <span class="text-3xl font-black text-amber-900">:</span>

          {/* Minute Button (0-59) */}
          <button
            type="button"
            onClick$={() => (state.activeUnit = 'minute')}
            class={`px-5 py-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
              state.activeUnit === 'minute'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span class="text-3xl font-black block tracking-tight">
              {String(state.minute).padStart(2, '0')}
            </span>
          </button>

          {/* AM / PM Segmented Switch - Generous Click Targets */}
          <div class="flex flex-col gap-1.5 p-1 bg-amber-100/70 rounded-2xl border border-amber-200">
            <button
              type="button"
              onClick$={() => (state.period = 'AM')}
              class={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                state.period === 'AM'
                  ? 'bg-amber-400 text-amber-950 shadow-xs ring-1 ring-amber-400'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick$={() => (state.period = 'PM')}
              class={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                state.period === 'PM'
                  ? 'bg-amber-500 text-white shadow-xs ring-1 ring-amber-500'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Minute Precision Mode Toggle - Enlarged Buttons */}
        <div class="flex items-center justify-center p-1 bg-amber-100/60 rounded-2xl border border-amber-200 text-xs">
          <button
            type="button"
            onClick$={() => (state.minuteStepMode = 'step5')}
            class={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer text-center text-xs ${
              state.minuteStepMode === 'step5'
                ? 'bg-white text-amber-950 shadow-2xs font-black'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            Par 5 min
          </button>
          <button
            type="button"
            onClick$={() => (state.minuteStepMode = 'step1')}
            class={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer text-center text-xs ${
              state.minuteStepMode === 'step1'
                ? 'bg-white text-amber-950 shadow-2xs font-black'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            Par 1 min
          </button>
        </div>

        {/* Concentric Clock SVG Dial */}
        <div class="relative w-full max-w-[300px] sm:max-w-[320px] mx-auto select-none touch-none">
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
              stroke-width={state.activeUnit === 'minute' ? 3.5 : 2.5}
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
              stroke-width={state.activeUnit === 'hour' ? 4.5 : 3.5}
              stroke-linecap="round"
            />

            {/* Center pin decoration */}
            <circle cx={cx} cy={cy} r={7.5} fill="#78350F" />
            <circle cx={cx} cy={cy} r={3} fill="#FFFDF7" />

            {/* Selected Minute Target Badge */}
            <circle
              cx={minX}
              cy={minY}
              r={13.5}
              fill="#D97706"
              stroke="#FFFFFF"
              stroke-width="1.8"
            />
            <text
              x={minX}
              y={minY}
              text-anchor="middle"
              dominant-baseline="central"
              font-size="11"
              font-weight="900"
              fill="#FFFFFF"
            >
              {String(state.minute).padStart(2, '0')}
            </text>

            {/* Outer Circle (Minutes: Multiples of 5) */}
            {minuteMultiples.map((m) => {
              if (m.minute === state.minute) return null;
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
                    r={14}
                    fill="transparent"
                  />
                  <text
                    x={m.x}
                    y={m.y}
                    text-anchor="middle"
                    dominant-baseline="central"
                    font-size="11"
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
              r={13.5}
              fill="#F59E0B"
              stroke="#451A03"
              stroke-width="1.5"
            />
            <text
              x={hourX}
              y={hourY}
              text-anchor="middle"
              dominant-baseline="central"
              font-size="12"
              font-weight="900"
              fill="#451A03"
            >
              {state.hour12}
            </text>

            {/* Inner Circle (12 Hours: 1 to 12) */}
            {hours12List.map((h) => {
              if (h.hour === state.hour12) return null;
              return (
                <g
                  key={`h-${h.hour}`}
                  onClick$={() => {
                    state.hour12 = h.hour;
                    state.activeUnit = 'hour';
                  }}
                  class="cursor-pointer"
                >
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={14}
                    fill="transparent"
                  />
                  <text
                    x={h.x}
                    y={h.y}
                    text-anchor="middle"
                    dominant-baseline="central"
                    font-size="12"
                    font-weight="800"
                    fill="#78350F"
                  >
                    {h.hour}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Quick Steppers & Preset - Larger, comfortable buttons */}
        <div class="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick$={handleSetNow$}
            class="px-4 py-2.5 text-xs font-black rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
          >
            Maintenant
          </button>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              onClick$={() => (state.minute = (state.minute - 5 + 60) % 60)}
              class="px-3 py-2 text-xs font-black rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 cursor-pointer transition-colors"
              title="-5 minutes"
            >
              -5m
            </button>
            <button
              type="button"
              onClick$={() => (state.minute = (state.minute + 5) % 60)}
              class="px-3 py-2 text-xs font-black rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 cursor-pointer transition-colors"
              title="+5 minutes"
            >
              +5m
            </button>
            <button
              type="button"
              onClick$={() => (state.minute = (state.minute - 1 + 60) % 60)}
              class="px-2.5 py-2 text-xs font-black rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 cursor-pointer transition-colors"
              title="-1 minute"
            >
              -1m
            </button>
            <button
              type="button"
              onClick$={() => (state.minute = (state.minute + 1) % 60)}
              class="px-2.5 py-2 text-xs font-black rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 cursor-pointer transition-colors"
              title="+1 minute"
            >
              +1m
            </button>
          </div>
        </div>

        {/* Action Buttons - Enlarged & Generous */}
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-amber-100">
          <button
            type="button"
            onClick$={onClose$}
            class="px-5 py-2.5 text-xs font-bold rounded-2xl text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick$={handleConfirm$}
            class="px-6 py-3 text-xs font-black rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <SvgIcon name="check" size={16} />
            <span>Valider</span>
          </button>
        </div>
      </div>
    </div>
  );
});
