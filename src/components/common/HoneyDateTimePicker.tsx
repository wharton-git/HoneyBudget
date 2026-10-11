import { component$, useStore, $, useVisibleTask$, type PropFunction } from '@builder.io/qwik';
import { SvgIcon } from '../icons/SvgIcon';
import { ConcentricClockModal } from './ConcentricClockModal';

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const WEEK_DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

interface HoneyDateTimePickerProps {
  value: string; // "YYYY-MM-DD" or "YYYY-MM-DD HH:mm"
  onChange$: PropFunction<(newValue: string) => void>;
  label?: string;
}

const parseInitial = (val: string) => {
  const today = new Date();
  let dStr = '';
  let tStr = '';

  if (val && val.includes(' ')) {
    const parts = val.split(' ');
    dStr = parts[0];
    tStr = parts[1] || '';
  } else if (val && val.includes('T')) {
    const parts = val.split('T');
    dStr = parts[0];
    tStr = parts[1]?.substring(0, 5) || '';
  } else if (val) {
    dStr = val;
  } else {
    dStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    tStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
  }

  const dParts = dStr.split('-').map(Number);
  const yr = dParts[0] || today.getFullYear();
  const mo = (dParts[1] ? dParts[1] - 1 : today.getMonth());
  const day = dParts[2] || today.getDate();

  let hr = '';
  let min = '';
  if (tStr && tStr.includes(':')) {
    const [h, m] = tStr.split(':');
    hr = h.padStart(2, '0');
    min = m.padStart(2, '0');
  }

  return {
    selectedDate: dStr,
    viewYear: yr,
    viewMonth: mo,
    selectedDay: day,
    hour: hr,
    minute: min,
  };
};

export const formatTimeAmPm = (tStr?: string): string => {
  if (!tStr || !tStr.includes(':')) return tStr || '';
  const [hPart, mPart] = tStr.split(':');
  const h = parseInt(hPart, 10);
  const m = parseInt(mPart, 10);
  if (isNaN(h) || isNaN(m)) return tStr;
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};

export const HoneyDateTimePicker = component$<HoneyDateTimePickerProps>(({ value, onChange$, label = 'Date et heure' }) => {
  const initial = parseInitial(value);

  const state = useStore({
    isOpen: false,
    isTimeModalOpen: false,
    selectedDate: initial.selectedDate,
    viewYear: initial.viewYear,
    viewMonth: initial.viewMonth,
    hour: initial.hour,
    minute: initial.minute,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => value);
    const parsed = parseInitial(value);
    state.selectedDate = parsed.selectedDate;
    state.viewYear = parsed.viewYear;
    state.viewMonth = parsed.viewMonth;
    state.hour = parsed.hour;
    state.minute = parsed.minute;
  });

  const emitChange$ = $((newDate: string, newHour: string, newMinute: string) => {
    let result = newDate;
    if (newHour && newMinute) {
      result = `${newDate} ${newHour}:${newMinute}`;
    }
    onChange$(result);
  });

  const handlePrevMonth$ = $(() => {
    if (state.viewMonth === 0) {
      state.viewMonth = 11;
      state.viewYear -= 1;
    } else {
      state.viewMonth -= 1;
    }
  });

  const handleNextMonth$ = $(() => {
    if (state.viewMonth === 11) {
      state.viewMonth = 0;
      state.viewYear += 1;
    } else {
      state.viewMonth += 1;
    }
  });

  const handleSelectDay$ = $((dayNum: number, targetMonth?: number, targetYear?: number) => {
    const yr = targetYear ?? state.viewYear;
    const mo = targetMonth ?? state.viewMonth;
    const dateStr = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    state.selectedDate = dateStr;
    state.viewYear = yr;
    state.viewMonth = mo;
    emitChange$(dateStr, state.hour, state.minute);
  });

  const handleSetToday$ = $(() => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    state.selectedDate = dateStr;
    state.viewYear = now.getFullYear();
    state.viewMonth = now.getMonth();
    emitChange$(dateStr, state.hour, state.minute);
  });

  const handleSetYesterday$ = $(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    state.selectedDate = dateStr;
    state.viewYear = yesterday.getFullYear();
    state.viewMonth = yesterday.getMonth();
    emitChange$(dateStr, state.hour, state.minute);
  });

  const handleSetNowTime$ = $(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    state.hour = h;
    state.minute = m;
    emitChange$(state.selectedDate, h, m);
  });

  const handleSetPresetTime$ = $((h: string, m: string) => {
    state.hour = h;
    state.minute = m;
    emitChange$(state.selectedDate, h, m);
  });

  const handleClearTime$ = $(() => {
    state.hour = '';
    state.minute = '';
    onChange$(state.selectedDate);
  });

  // Calculate calendar grid for state.viewYear and state.viewMonth
  const daysInCurrentMonth = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(state.viewYear, state.viewMonth, 0).getDate();
  const startDayOfWeek = (new Date(state.viewYear, state.viewMonth, 1).getDay() + 6) % 7; // Monday = 0

  const prevMonthCells: number[] = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    prevMonthCells.push(daysInPrevMonth - i);
  }

  const currentMonthCells: number[] = [];
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    currentMonthCells.push(d);
  }

  const totalSoFar = prevMonthCells.length + currentMonthCells.length;
  const nextMonthCellsCount = (7 - (totalSoFar % 7)) % 7;
  const nextMonthCells: number[] = [];
  for (let n = 1; n <= nextMonthCellsCount; n++) {
    nextMonthCells.push(n);
  }

  // Format trigger display text
  const todayDateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayDateStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;

  let dateLabel = state.selectedDate;
  if (state.selectedDate === todayDateStr) {
    dateLabel = "Aujourd'hui";
  } else if (state.selectedDate === yesterdayDateStr) {
    dateLabel = 'Hier';
  } else if (state.selectedDate) {
    const parts = state.selectedDate.split('-');
    if (parts.length === 3) {
      const d = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parts[0];
      dateLabel = `${d} ${MONTH_NAMES_FR[m]?.substring(0, 4)}. ${y}`;
    }
  }

  const timeLabel = state.hour && state.minute
    ? formatTimeAmPm(`${state.hour}:${state.minute}`)
    : 'Sans heure';

  return (
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="block text-xs font-bold text-amber-900">
          {label}
        </label>
        <span class="text-[11px] font-semibold text-slate-500">
          {state.selectedDate}
        </span>
      </div>

      {/* Trigger buttons: Date and Time */}
      <div class="flex items-center gap-2">
        <button
          type="button"
          onClick$={() => (state.isOpen = !state.isOpen)}
          class={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
            state.isOpen
              ? 'border-amber-400 bg-amber-50/60 shadow-sm'
              : 'border-amber-200 bg-white hover:border-amber-300'
          }`}
        >
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <SvgIcon name="calendar" size={15} />
            </div>
            <div>
              <div class="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>{dateLabel}</span>
                <span class="text-slate-400">•</span>
                <span class="text-amber-800 font-bold">{state.selectedDate}</span>
              </div>
            </div>
          </div>

          <SvgIcon
            name={state.isOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            class="text-amber-700"
          />
        </button>

        <button
          type="button"
          onClick$={() => (state.isTimeModalOpen = true)}
          class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50/60 text-amber-950 transition-all cursor-pointer shadow-2xs"
          title="Sélectionner l'heure (double cadran concentrique)"
        >
          <div class="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
            <SvgIcon name="clock" size={14} />
          </div>
          <span class="text-xs font-black tracking-tight">{timeLabel}</span>
        </button>
      </div>

      {/* Popover / Expandable Honey Calendar */}
      {state.isOpen && (
        <div class="mt-2 p-4 bg-white rounded-3xl border-2 border-amber-300 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Quick shortcuts */}
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick$={handleSetToday$}
              class="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick$={handleSetYesterday$}
              class="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 transition-colors"
            >
              Hier
            </button>
            <div class="h-4 w-px bg-amber-200 mx-1" />
            <button
              type="button"
              onClick$={handleSetNowTime$}
              class="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1"
            >
              <SvgIcon name="clock" size={11} class="text-amber-600" />
              <span>Maintenant</span>
            </button>
          </div>

          {/* Month Header Navigation */}
          <div class="flex items-center justify-between px-1">
            <button
              type="button"
              onClick$={handlePrevMonth$}
              class="w-8 h-8 rounded-xl hover:bg-amber-100 text-amber-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Mois précédent"
            >
              <SvgIcon name="chevron-left" size={16} />
            </button>

            <div class="text-sm font-black text-amber-950">
              {MONTH_NAMES_FR[state.viewMonth]} {state.viewYear}
            </div>

            <button
              type="button"
              onClick$={handleNextMonth$}
              class="w-8 h-8 rounded-xl hover:bg-amber-100 text-amber-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Mois suivant"
            >
              <SvgIcon name="chevron-right" size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div class="grid grid-cols-7 gap-1 text-center">
            {WEEK_DAYS_FR.map((d) => (
              <span key={d} class="text-[10px] font-black uppercase text-amber-800/80">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div class="grid grid-cols-7 gap-1">
            {/* Prev month days */}
            {prevMonthCells.map((dayNum) => {
              const prevMo = state.viewMonth === 0 ? 11 : state.viewMonth - 1;
              const prevYr = state.viewMonth === 0 ? state.viewYear - 1 : state.viewYear;
              return (
                <button
                  type="button"
                  key={`prev-${dayNum}`}
                  onClick$={() => handleSelectDay$(dayNum, prevMo, prevYr)}
                  class="h-8 rounded-xl text-xs font-semibold text-slate-300 hover:bg-amber-50 hover:text-slate-500 transition-colors"
                >
                  {dayNum}
                </button>
              );
            })}

            {/* Current month days */}
            {currentMonthCells.map((dayNum) => {
              const cellDateStr = `${state.viewYear}-${String(state.viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = state.selectedDate === cellDateStr;
              const isToday = cellDateStr === todayDateStr;

              return (
                <button
                  type="button"
                  key={`cur-${dayNum}`}
                  onClick$={() => handleSelectDay$(dayNum)}
                  class={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300 scale-105'
                      : isToday
                      ? 'border border-amber-400 text-amber-950 font-black hover:bg-amber-100'
                      : 'text-slate-800 hover:bg-amber-100/80'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}

            {/* Next month days */}
            {nextMonthCells.map((dayNum) => {
              const nextMo = state.viewMonth === 11 ? 0 : state.viewMonth + 1;
              const nextYr = state.viewMonth === 11 ? state.viewYear + 1 : state.viewYear;
              return (
                <button
                  type="button"
                  key={`next-${dayNum}`}
                  onClick$={() => handleSelectDay$(dayNum, nextMo, nextYr)}
                  class="h-8 rounded-xl text-xs font-semibold text-slate-300 hover:bg-amber-50 hover:text-slate-500 transition-colors"
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Time Picker Section */}
          <div class="pt-3 border-t border-amber-100 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <SvgIcon name="clock" size={14} class="text-amber-600" />
                <span>Heure de l'opération</span>
              </span>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick$={() => handleSetPresetTime$('12', '00')}
                  class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer"
                >
                  12:00
                </button>
                <button
                  type="button"
                  onClick$={() => handleSetPresetTime$('19', '00')}
                  class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer"
                >
                  19:00
                </button>
                {state.hour && (
                  <button
                    type="button"
                    onClick$={handleClearTime$}
                    class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Clock Modal Trigger Bar */}
            <div class="flex items-center gap-2">
              <button
                type="button"
                onClick$={() => (state.isTimeModalOpen = true)}
                class="flex-1 flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border-2 border-amber-200 text-amber-950 transition-all cursor-pointer group text-left"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <SvgIcon name="clock" size={15} />
                  </div>
                  <div>
                    <span class="text-xs font-black text-amber-950 block">
                      {state.hour && state.minute ? formatTimeAmPm(`${state.hour}:${state.minute}`) : '12:00 PM'}
                    </span>
                    <span class="text-[9px] font-bold text-amber-800/80 block">
                      Cadran 12h (AM/PM) & Minutes
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400 text-amber-950 text-[11px] font-black shadow-xs">
                  <span>Modifier</span>
                  <SvgIcon name="chevron-right" size={12} />
                </div>
              </button>

              <button
                type="button"
                onClick$={() => (state.isOpen = false)}
                class="px-3.5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1 self-stretch"
              >
                <SvgIcon name="check" size={14} />
                <span>OK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Concentric Clock Modal (2 circles: Hours 0-23 inside, Minutes 0-59 outside) */}
      <ConcentricClockModal
        isOpen={state.isTimeModalOpen}
        initialHour={state.hour || '12'}
        initialMinute={state.minute || '00'}
        onClose$={$(() => (state.isTimeModalOpen = false))}
        onSelect$={$((h: string, m: string) => {
          state.hour = h;
          state.minute = m;
          emitChange$(state.selectedDate, h, m);
        })}
      />
    </div>
  );
});
